export interface IEditarDevolucionProv{
    idUsuario: number;
    codigoDevolucion: string;
    descripcionProblema: string;
    fechaEnvio: Date;
    fechaRecepcion: Date;
    codigoSeguimiento: string;
    idEmpresaTransporte: number;
    idMotivoDevolucion: number;
    codigoProvincia: string;
}