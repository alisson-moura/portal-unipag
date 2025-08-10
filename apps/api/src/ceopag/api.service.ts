import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { ConfigService } from '@nestjs/config';
import { Env } from '../config/env.schema';
import { PrismaService } from '../prisma/prisma.service';
import {
  EstabelecimentoCeoPagDto,
  PaginatedEstabelecimentoDto,
} from './dto/estabelecimento.dto';
import {
  GetRecebimentosCeoPagParamsDto,
  RecebimentosCeoPagDto,
} from './dto/recebimentos.dto';
import { LoginResponseDto } from './dto/login.dto';
import {
  TransactionQueryDto,
  TransactionResponseDto,
} from './dto/transacoes.dto';
import { PeriodQueryDto } from 'src/relatorios/dto/period-query';
import { ResumoTransacoesDto } from './dto/resumo-transacoes.dto';
import { ResumoBandeirasDto } from './dto/resumo-bandeiras';
import { ResumoTransacoesPeriodoDto } from './dto/resumo-transacoes-periodo';
import { TransacaoCsvDto } from './dto/transacoes-csv.dto';
import * as Papa from 'papaparse';

export type AccountIdentifier = 'ONE' | 'TWO';

@Injectable()
export class ApiCeoPagService {
  private readonly BASE_URL: string;
  private readonly VERSION_API: string;
  private readonly PREFIX: string;

  constructor(
    private configService: ConfigService<Env>,
    private httpService: HttpService,
    private prisma: PrismaService,
  ) {
    this.BASE_URL = configService.getOrThrow('MOVINGPAY_BASE_URL');
    this.VERSION_API = configService.getOrThrow('MOVINGPAY_API_VERSION');
    this.PREFIX = configService.getOrThrow('MOVINGPAY_PREFIX');
  }

  async loginToAllAccounts() {
    try {
      const [loginOneResult, loginTwoResult] = await Promise.all([
        this.loginByAccount('ONE'),
        this.loginByAccount('TWO'),
      ]);
      return {
        accountOne: loginOneResult,
        accountTwo: loginTwoResult,
      };
    } catch (error) {
      console.error('Falha no processo de login em lote.', error);
      throw new Error('Não foi possível fazer login em uma ou mais contas.');
    }
  }

  private async loginByAccount(
    account: AccountIdentifier,
  ): Promise<LoginResponseDto> {
    const url = `${this.BASE_URL}/${this.PREFIX}/${this.VERSION_API}/acessar`;

    const emailKey = `MOVINGPAY_ACCOUNT_${account}_EMAIL`;
    const passwordKey = `MOVINGPAY_ACCOUNT_${account}_PASSWORD`;

    const body = {
      email: this.configService.get<string>(emailKey, { infer: true }),
      password: this.configService.get<string>(passwordKey, { infer: true }),
    };

    const { data } = await firstValueFrom(
      this.httpService
        .post<LoginResponseDto>(url, body, {
          headers: { 'Content-Type': 'application/json' },
        })
        .pipe(
          catchError((error: AxiosError) => {
            console.error(
              `Erro ao fazer login na conta ${account}:`,
              error.message,
            );
            throw error;
          }),
        ),
    );

    return data;
  }

  /**
   * @description Busca estabelecimentos de TODAS as contas, unifica, ordena e pagina o resultado.
   * Este é o método que seu controller deve chamar.
   */
  async todosEstabelecimentos() {
    const { accountOne, accountTwo } = await this.loginToAllAccounts();

    const [estabelecimentosAccOne, estabelecimentosAccTwo] = await Promise.all([
      this.fetchAllEstabelecimentosForAccount(accountOne, 'ONE'),
      this.fetchAllEstabelecimentosForAccount(accountTwo, 'TWO'),
    ]);

    const allEstabelecimentos = [
      ...estabelecimentosAccOne,
      ...estabelecimentosAccTwo,
    ];

    allEstabelecimentos.sort((a, b) =>
      a.social_reason.localeCompare(b.social_reason),
    );

    return allEstabelecimentos;
  }

  /**
   * @private
   * @description Busca TODOS os estabelecimentos de UMA conta, percorrendo todas as páginas.
   */
  private async fetchAllEstabelecimentosForAccount(
    auth: LoginResponseDto,
    accountSource: AccountIdentifier,
  ): Promise<EstabelecimentoCeoPagDto[]> {
    const firstPageResponse = await this.fetchEstabelecimentosPage(auth, 1);
    const allEstabelecimentos = [...firstPageResponse.data];
    const lastPage = firstPageResponse.lastPage;

    if (lastPage > 1) {
      const pagePromises: Promise<PaginatedEstabelecimentoDto>[] = [];
      for (let page = 2; page <= lastPage; page++) {
        pagePromises.push(this.fetchEstabelecimentosPage(auth, page));
      }
      const remainingPagesResults = await Promise.all(pagePromises);

      remainingPagesResults.forEach((result) => {
        allEstabelecimentos.push(...result.data);
      });
    }

    const mappedEstabelecimentos = allEstabelecimentos.map((est) => ({
      ...est,
      account_source: accountSource,
    }));

    return mappedEstabelecimentos;
  }

  /**
   * @private
   * @description Busca UMA PÁGINA de estabelecimentos de uma conta específica.
   */
  private async fetchEstabelecimentosPage(
    auth: LoginResponseDto,
    page: number,
  ): Promise<PaginatedEstabelecimentoDto> {
    const url = new URL(
      `${this.BASE_URL}/${this.PREFIX}/${this.VERSION_API}/estabelecimentos`,
    );
    url.searchParams.append('page', String(page));
    url.searchParams.append('limit', '100');

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${auth.access_token}`,
      Customer: auth.customers_id,
      Vendor: auth.vendor_id,
    };
    const { data } = await firstValueFrom(
      this.httpService
        .get<PaginatedEstabelecimentoDto>(url.toString(), { headers })
        .pipe(
          catchError((error: AxiosError) => {
            throw new HttpException(
              error.message,
              HttpStatus.INTERNAL_SERVER_ERROR,
            );
          }),
        ),
    );

    return data;
  }

  async recebimentosLiquidados(
    params: GetRecebimentosCeoPagParamsDto,
  ): Promise<RecebimentosCeoPagDto | null> {
    const estabelecimento = await this.prisma.estabelecimentoCeoPag.findUnique({
      where: { id: params.id },
    });

    if (!estabelecimento) return null;

    const auth = await this.loginByAccount(
      estabelecimento.account_source as AccountIdentifier,
    );

    const url = `${this.BASE_URL}/${this.PREFIX}/${this.VERSION_API}/financeiro/recebiveis/liquidados`;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${auth.access_token}`,
      Customer: auth.customers_id,
      Vendor: auth.vendor_id,
    };
    const queryParams = {
      ...params,
      mid: estabelecimento.ceo_pag_id,
      page: params.page ?? 1,
      report_type: 'consolidated',
    };
    try {
      const { data } = await firstValueFrom(
        this.httpService
          .get<RecebimentosCeoPagDto>(url, {
            headers,
            params: queryParams,
          })
          .pipe(
            catchError((error: AxiosError) => {
              console.error(error.response?.data);
              throw new HttpException(
                error.message,
                HttpStatus.INTERNAL_SERVER_ERROR,
              );
            }),
          ),
      );
      return data;
    } catch (error) {
      console.error('Falha ao buscar recebíveis liquidados:', error);
      throw error;
    }
  }

  /**
   * @description relatório da MovingPay de vendas/transações
   */
  async transacoes(
    account: AccountIdentifier,
    query: TransactionQueryDto,
  ): Promise<TransactionResponseDto> {
    const url = `${this.BASE_URL}/${this.PREFIX}/${this.VERSION_API}/transacoes`;
    const auth = await this.loginByAccount(account);
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${auth.access_token}`,
      Customer: auth.customers_id,
      Vendor: auth.vendor_id,
    };

    try {
      const { data } = await firstValueFrom(
        this.httpService
          .get<TransactionResponseDto>(url, {
            headers,
            params: {
              ...query,
              limit: 10,
            },
          })
          .pipe(
            catchError((error: AxiosError) => {
              console.error(error.response?.data);
              throw new HttpException(
                error.message,
                HttpStatus.INTERNAL_SERVER_ERROR,
              );
            }),
          ),
      );
      return data;
    } catch (error) {
      console.error('Falha ao buscar recebíveis liquidados:', error);
      throw error;
    }
  }

  async todasTransacoes(
    account: AccountIdentifier,
    query: TransactionQueryDto,
  ): Promise<TransacaoCsvDto[]> {
    const url = `${this.BASE_URL}/${this.PREFIX}/${this.VERSION_API}/transacoes`;
    const auth = await this.loginByAccount(account);
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${auth.access_token}`,
      Customer: auth.customers_id,
      Vendor: auth.vendor_id,
    };
    try {
      const { data } = await firstValueFrom(
        this.httpService
          .get<string>(url, {
            headers,
            params: query,
            responseType: 'text',
          })
          .pipe(
            catchError((error: AxiosError) => {
              console.error(error.response?.data);
              throw new HttpException(
                error.message,
                HttpStatus.INTERNAL_SERVER_ERROR,
              );
            }),
          ),
      );

      const parsed = Papa.parse<TransacaoCsvDto>(data, {
        header: true,
        delimiter: ';',
        skipEmptyLines: true,
      });

      return parsed.data;
    } catch (error) {
      console.error('Falha ao buscar resumo transações:', error);
      throw error;
    }
  }

  /**
   * @description dashboard da movingpay resumo transacoes
   */
  async resumoTransacoes(
    account: AccountIdentifier,
    query: PeriodQueryDto,
  ): Promise<ResumoTransacoesDto> {
    const url = `${this.BASE_URL}/${this.PREFIX}/${this.VERSION_API}/transacoes/resumo`;
    const auth = await this.loginByAccount(account);
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${auth.access_token}`,
      Customer: auth.customers_id,
      Vendor: auth.vendor_id,
    };

    try {
      const { data } = await firstValueFrom(
        this.httpService
          .get<ResumoTransacoesDto>(url, {
            headers,
            params: query,
          })
          .pipe(
            catchError((error: AxiosError) => {
              console.error(error.response?.data);
              throw new HttpException(
                error.message,
                HttpStatus.INTERNAL_SERVER_ERROR,
              );
            }),
          ),
      );
      return data;
    } catch (error) {
      console.error('Falha ao buscar resumo transações:', error);
      throw error;
    }
  }

  /**
   * @description dashboard da movingpay resumo bandeiras
   */
  async resumoBandeiras(
    account: AccountIdentifier,
    query: PeriodQueryDto,
  ): Promise<ResumoBandeirasDto> {
    const url = `${this.BASE_URL}/${this.PREFIX}/${this.VERSION_API}/transacoes/resumo/bandeiras`;
    const auth = await this.loginByAccount(account);
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${auth.access_token}`,
      Customer: auth.customers_id,
      Vendor: auth.vendor_id,
    };

    try {
      const { data } = await firstValueFrom(
        this.httpService
          .get<ResumoBandeirasDto>(url, {
            headers,
            params: query,
          })
          .pipe(
            catchError((error: AxiosError) => {
              console.error(error.response?.data);
              throw new HttpException(
                error.message,
                HttpStatus.INTERNAL_SERVER_ERROR,
              );
            }),
          ),
      );
      return data;
    } catch (error) {
      console.error('Falha ao buscar resumo bandeiras:', error);
      throw error;
    }
  }

  /**
   * @description dashboard da movingpay resumo status transacoes
   */
  async resumoStatusTransacoes(
    account: AccountIdentifier,
    query: PeriodQueryDto,
  ): Promise<ResumoTransacoesPeriodoDto> {
    const url = `${this.BASE_URL}/${this.PREFIX}/${this.VERSION_API}/transacoes/resumo/periodo`;
    const auth = await this.loginByAccount(account);
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${auth.access_token}`,
      Customer: auth.customers_id,
      Vendor: auth.vendor_id,
    };

    try {
      const { data } = await firstValueFrom(
        this.httpService
          .get<ResumoTransacoesPeriodoDto>(url, {
            headers,
            params: query,
          })
          .pipe(
            catchError((error: AxiosError) => {
              console.error(error.response?.data);
              throw new HttpException(
                error.message,
                HttpStatus.INTERNAL_SERVER_ERROR,
              );
            }),
          ),
      );
      return data;
    } catch (error) {
      console.error('Falha ao buscar resumo bandeiras:', error);
      throw error;
    }
  }
}
