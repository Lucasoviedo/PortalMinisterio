export interface IEditarDevolucionLab{
    idUsuario: string;
    codigoDevolucion: string;
    descripcionProblema: string;
    fechaEnvio: Date;
    fechaRecepcion: Date;
    codigoSeguimiento: string;
    idEmpresaTransporte: number;
    idMotivoDevolucion: number;
}