export interface INuevaDevolucionProv{
    idUsario: number;
    codigoDevolucion: string;
    descripcionProblema: string;
    idMotivoDevolucion: number;
    codigoProvincias: string;
    fechaEnvio: Date;
    fechaRecepcion: Date;
}