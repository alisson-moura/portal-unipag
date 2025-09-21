import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma/prisma.service';
import { ApiCeoPagService } from './api.service';
import { EstabelecimentoCeoPag, Prisma } from '@prisma/client';
import { EstabelecimentoCeoPagDto } from './dto/estabelecimento.dto';

@Injectable()
export class SincronizadorCeoPag implements OnApplicationBootstrap {
  private readonly logger = new Logger(SincronizadorCeoPag.name);
  private isSyncRunning = false;

  constructor(
    private readonly prisma: PrismaService,
    private readonly apiCeoPagService: ApiCeoPagService,
  ) {}

  async sincronizarEstabelecimentos(): Promise<void> {
    if (this.isSyncRunning) {
      this.logger.warn(
        'Sincronização já está em andamento. Pulando esta execução.',
      );
      return;
    }

    this.isSyncRunning = true;
    this.logger.log('🚀 Iniciando a sincronização de estabelecimentos...');

    try {
      // 1. BUSCAR DADOS DA API
      const apiEstabelecimentos =
        await this.apiCeoPagService.todosEstabelecimentos();
      this.logger.log(
        `API retornou ${apiEstabelecimentos.length} estabelecimentos únicos.`,
      );

      const dbEstabelecimentos =
        await this.prisma.estabelecimentoCeoPag.findMany({
          where: { deleted_at: null },
        });
      this.logger.log(
        `Encontrados ${dbEstabelecimentos.length} estabelecimentos ativos no banco de dados.`,
      );

      // CONCILIAR USANDO CHAVE COMPOSTA
      // A chave do Map será uma string no formato "id-account_source", ex: "123-ONE"
      const createCompositeKey = (id: number, source: string) =>
        `${id}-${source}`;

      const apiMap = new Map(
        apiEstabelecimentos.map((e) => [
          createCompositeKey(parseInt(e.id), e.account_source),
          e,
        ]),
      );
      const dbMap = new Map(
        dbEstabelecimentos.map((e) => [
          createCompositeKey(e.ceo_pag_id, e.account_source),
          e,
        ]),
      );

      const toCreate: Prisma.EstabelecimentoCeoPagCreateInput[] = [];
      const toUpdate: Prisma.EstabelecimentoCeoPagCreateInput[] = [];
      const toSoftDelete: EstabelecimentoCeoPag[] = [];

      // Verifica o que CRIAR ou ATUALIZAR
      for (const [compositeKey, apiEst] of apiMap.entries()) {
        const dbEst = dbMap.get(compositeKey);

        const dataToUpsert = {
          ceo_pag_id: parseInt(apiEst.id),
          document_number: apiEst.document_number,
          social_reason: apiEst.social_reason,
          name: apiEst.name,
          status: apiEst.status,
          account_source: apiEst.account_source,
          created_at: new Date(),
          updated_at: null,
          deleted_at: null,
        };

        if (!dbEst) {
          toCreate.push(dataToUpsert);
        } else if (this.areDifferent(apiEst, dbEst)) {
          toUpdate.push(dataToUpsert);
        }
      }

      // Verifica o que DELETAR (soft delete)
      for (const [compositeKey, dbEst] of dbMap.entries()) {
        if (!apiMap.has(compositeKey)) {
          toSoftDelete.push(dbEst);
        }
      }

      this.logger.log(
        `Para criar: ${toCreate.length}, Para atualizar: ${toUpdate.length}, Para deletar: ${toSoftDelete.length}`,
      );

      // Executar ações no banco
      await this.prisma.$transaction(async (tx) => {
        if (toCreate.length > 0) {
          await tx.estabelecimentoCeoPag.createMany({ data: toCreate });
        }

        if (toUpdate.length > 0) {
          for (const est of toUpdate) {
            await tx.estabelecimentoCeoPag.update({
              where: {
                ceo_pag_id_account_source: {
                  account_source: est.account_source,
                  ceo_pag_id: est.ceo_pag_id,
                },
              },
              data: { ...est, updated_at: new Date() },
            });
          }
        }

        if (toSoftDelete.length > 0) {
          for (const est of toSoftDelete) {
            await tx.estabelecimentoCeoPag.update({
              where: {
                ceo_pag_id_account_source: {
                  account_source: est.account_source,
                  ceo_pag_id: est.ceo_pag_id,
                },
              },
              data: { deleted_at: new Date() },
            });
          }
        }
      });

      this.logger.log(
        '✅ Sincronização com chave composta concluída com sucesso!',
      );
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      this.logger.error('❌ Falha na sincronização.', error.stack);
    } finally {
      // ESTE BLOCO SERÁ EXECUTADO SEMPRE, liberando a trava
      this.logger.log('Finalizando o processo de sincronização.');
      this.isSyncRunning = false;
    }
  }

  @Cron(CronExpression.EVERY_HOUR)
  handleCron() {
    this.logger.log('Executando sincronização agendada (de hora em hora)...');
    void this.sincronizarEstabelecimentos();
  }

  async onApplicationBootstrap() {
    this.logger.log(
      'Executando sincronização na inicialização do aplicativo...',
    );
    await this.sincronizarEstabelecimentos();
  }

  private areDifferent(
    apiRecord: EstabelecimentoCeoPagDto,
    dbRecord: EstabelecimentoCeoPag,
  ): boolean {
    return (
      apiRecord.document_number !== dbRecord.document_number ||
      apiRecord.social_reason !== dbRecord.social_reason ||
      apiRecord.name !== dbRecord.name ||
      apiRecord.status !== dbRecord.status ||
      apiRecord.account_source !== dbRecord.account_source
    );
  }
}
