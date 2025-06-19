import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import {HttpService} from "@nestjs/axios";
import {catchError, firstValueFrom} from 'rxjs';
import {ListarEstabelecimentoResponseDto, LoginResponseDto} from "./responses.dto";
import {AxiosError} from "axios";
import {ConfigService} from "@nestjs/config";
import {Env} from "../config/env.schema";

@Injectable()
export class ApiCeoPagService {
    private readonly BASE_URL: string
    private readonly VERSION_API: string
    private readonly PREFIX: string

    constructor(private configService: ConfigService<Env>, private httpService: HttpService) {
        this.BASE_URL = configService.getOrThrow("MOVINGPAY_BASE_URL")
        this.VERSION_API = configService.getOrThrow("MOVINGPAY_API_VERSION")
        this.PREFIX = configService.getOrThrow("MOVINGPAY_PREFIX")
    }

    async login() {
        const url = `${this.BASE_URL}/${this.PREFIX}/${this.VERSION_API}/acessar`;
        const headers = {
            'Content-Type': 'application/json',
        }
        const body = {
            email: this.configService.get("MOVINGPAY_API_EMAIL"),
            password: this.configService.get("MOVINGPAY_API_PASSWORD")
        };
        const {data} = await firstValueFrom(
            this.httpService.post<LoginResponseDto>(url, body, {headers}).pipe(
                catchError((error: AxiosError) => {
                    console.error(error)
                    throw "Erro ao realizar login"
                })
            )
        )
        return data
    }

    async listarEstabelecimentos(params: { page: number, pageSize: number }) {
        const auth = await this.login()
        const url = `${this.BASE_URL}/${this.PREFIX}/${this.VERSION_API}/estabelecimentos`;
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${auth.access_token}`,
            'Customer': auth.customers_id,
            'Vendor': auth.vendor_id,
        }
        const body = {
            "page": params.page ?? 1,
            "limit": params.pageSize ?? 10
        }

        const {data} = await firstValueFrom(this.httpService.get<ListarEstabelecimentoResponseDto>(url, {
            headers,
            data: body
        }).pipe(
            catchError((error: AxiosError) => {
                    throw new HttpException('Erro desconhecido ao listar estabelecimentos.', HttpStatus.INTERNAL_SERVER_ERROR);
                }
            )
        ))

        return data
    }
}