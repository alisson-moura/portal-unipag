import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { ConfigService } from '@nestjs/config';
import { Env } from '../config/env.schema';
import { PrismaService } from '../prisma/prisma.service';
import { PaginatedEstabelecimentoDto } from './dto/estabelecimento.dto';
import {
  GetRecebimentosCeoPagParamsDto,
  RecebimentosCeoPagDto,
} from './dto/recebimentos.dto';
import { LoginResponseDto } from './dto/login.dto';

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

  async login() {
    const url = `${this.BASE_URL}/${this.PREFIX}/${this.VERSION_API}/acessar`;
    const headers = {
      'Content-Type': 'application/json',
    };
    const body = {
      email: this.configService.get('MOVINGPAY_API_EMAIL', {
        infer: true,
      }),
      password: this.configService.get('MOVINGPAY_API_PASSWORD', {
        infer: true,
      }),
    };
    const { data } = await firstValueFrom(
      this.httpService.post<LoginResponseDto>(url, body, { headers }).pipe(
        catchError((error: AxiosError) => {
          console.error(error);
          throw error;
        }),
      ),
    );
    return data;
  }

  async listarEstabelecimentos(params: { page: number; busca: string }) {
    const auth = await this.login();
    const url = new URL(
      `${this.BASE_URL}/${this.PREFIX}/${this.VERSION_API}/estabelecimentos`,
    );
    url.searchParams.append('page', String(params.page ?? '1'));
    url.searchParams.append('limit', String('100'));
    if (params.busca) url.searchParams.append('busca', String(params.page));

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
  ): Promise<RecebimentosCeoPagDto> {
    const auth = await this.login();
    const url = `${this.BASE_URL}/${this.PREFIX}/${this.VERSION_API}/financeiro/recebiveis/liquidados`;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${auth.access_token}`,
      Customer: auth.customers_id,
      Vendor: auth.vendor_id,
    };
    const queryParams = {
      ...params,
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
}
