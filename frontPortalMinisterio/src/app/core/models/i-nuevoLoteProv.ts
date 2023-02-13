export interface INuevoLoteProv{
    idUsuario: number;
    codigoLote: string;
    codigoProvincia: string;
    fechaEnvio: Date;
    fechaRecepcion: Date;
    codigoEstado: string;
    codigoSeguimiento: string;
    idEmpresaTransporte: number;
}