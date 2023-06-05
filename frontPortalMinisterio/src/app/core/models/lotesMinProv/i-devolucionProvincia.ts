export interface IDevolucionProvincia{
    cantidadVacunas : number;
    codigoDevolucion : string;
    codigoProvincia : string;
    codigoLaboratorio: string;
    codigoLote: string;
    codigoSeguimiento: string;
    descripcionProblema: string;
    fechaEnvio: string;
    fechaRecepcion: Date;
    fechaRegistro: string;
    idEmpresaTransporte : number;
    idMotivoDevolucion : number;
    nombreLaboratorio : string;
    notificado : number;
}