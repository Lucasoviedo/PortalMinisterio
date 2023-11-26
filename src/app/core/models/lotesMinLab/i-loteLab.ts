export interface ILoteLab{
    idUsuario: number;
    codigoLaboratorio: string;
    cantidadVacunasADistribuir: number,
    cantidadVacunas: number,
    codigoEstado: string;
    codigoLote: string;
    fechaEnvio: Date;
    codigoSeguimiento: string;
    fechaRecepcion: Date;
    idEmpresaTransporte: number;
    distribuido: number;
    despachado: number;
    estado: string;
    nombreLaboratorio: string;
    fechaRegistro: Date;
    fechaVencimiento: Date;

    estadoMostrar : string;
}