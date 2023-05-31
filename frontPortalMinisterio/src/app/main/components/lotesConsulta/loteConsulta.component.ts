import { Component, OnInit } from "@angular/core";
import { DevolucionesService } from "../../api/resources/devoluciones.service";
import { INuevaDevolucionLab } from "src/app/core/models/lotesMinLab/i-nuevaDevolucionLab";
import { ProvinciaService } from "../../api/resources/provincias.service";
import { INuevoLoteProv } from "src/app/core/models/lotesMinProv/i-nuevoLoteProv";
import { IEmpresaTransporte } from "src/app/core/models/i-empresaTransporte";
import { IRejectReason } from "src/app/core/models/vacunas/i-rejectReason";
import { LotesGeneralService } from "../../api/resources/lotesGeneral.service";
import { IEnvioProvincia } from "src/app/core/models/lotesMinProv/i-envioProvincia";
import { Modal } from 'bootstrap';
import { IEditarLoteRecepcion } from "src/app/core/models/lotesMinLab/i-editarLote";
import { IDevolucionProvincia } from "src/app/core/models/lotesMinProv/i-devolucionProvincia";
import { ICriteriosBusqueda } from "src/app/core/models/i-criteriosBusqueda";
import { ICriteriosBusquedaProv } from "src/app/core/models/i-criteriosBusquedaProv";
import { LaboratorioService } from "../../api/resources/laboratorios.service";
import { LotesMinLabService } from "../../api/resources/lotesMinLab.service";
import { ILoteLab } from "src/app/core/models/lotesMinLab/i-loteLab";
import { ICriteriosBusquedaLotesLabs } from "src/app/core/models/i-criteriosBusquedaLotesLabs";
import { ICriteriosBusquedaDevolucionesLabs } from "src/app/core/models/i-criteriosBusquedaDevolucionesLabs";

@Component({
    selector: 'app-loteConsulta',
    templateUrl: './loteConsulta.component.html',
    styleUrls: ['./loteConsulta.component.css', '../generalStyles.css']
})

export class LotesConsultaComponent implements OnInit {

    myModal = document.getElementById('#confirmDataChangeModal');

    empresaTransporteActual = 0;
    fechaDevolucion = "";
    codigoSeguiminetoActual = "";

    loteDevolucionEditado: IEnvioProvincia = {
        codigoLote: "",
        codigoProvincia: "",
        idEmpresaTransporte: 0,
        fechaEnvio: "",
        codigoSeguimiento: "",
    }

    constructor(private devolucionesService: DevolucionesService,
        private lotesGeneralService: LotesGeneralService,
        private provinciasService: ProvinciaService,
        private laboratoriosService: LaboratorioService,
        private lotesMinLabService: LotesMinLabService) { }

    devolucionesLaboratorios: Array<INuevaDevolucionLab> = [];
    lotesProvincias: Array<INuevoLoteProv> = [];

    loteActual: Array<INuevoLoteProv> = [];

    lotesDevolucionesProvincias: Array<IDevolucionProvincia> = [];
    fechaActualizacionRecibo = new Date();
    loteActualizacionRecibo: IEditarLoteRecepcion = {
        idUsuario: 1,
        codigoLote: "",
        fechaRecepcion: ""
    };

    empresasTransporte: Array<IEmpresaTransporte> = [];
    rejectionReasonsData: Array<IRejectReason> = [];

    criteriaBusqueda: ICriteriosBusqueda = {
        codigoLaboratorio: undefined,
        codigoProvincia: undefined,
    }

    criteriaBusquedaLotesLabs: ICriteriosBusquedaLotesLabs = {
        codigoLaboratorio: undefined,
        codigoEstado: undefined,
    }

    criteriaBusquedaDevolucionesLabs: ICriteriosBusquedaDevolucionesLabs = {
        codigoLaboratorio: undefined
    }

    criteriaBusquedaProvincia: ICriteriosBusquedaProv = {
        codigoProvincia: undefined,
        codigoEstado: undefined,
    }

    codigosProvincias: Array<string> = [];

    lotesData: Array<ILoteLab> = [];



    ngOnInit() {

        this.provinciasService.getCodigoProvinciaFromIdUsuarioConectado().subscribe(
            (response: any) => {

                if (response.codigoProvincia == "-2") {
                    this.laboratoriosService.getCodigoLaboratorioFromIdUsuarioConectado().subscribe(
                        (response: any) => {

                            this.criteriaBusquedaLotesLabs.codigoLaboratorio = response.codigoLaboratorio;
                            this.criteriaBusquedaDevolucionesLabs.codigoLaboratorio = response.codigoLaboratorio;

                            this.lotesMinLabService.obtenerLotes(this.criteriaBusquedaLotesLabs).subscribe(
                                (response: any) => {
                                    this.lotesData = response || [];
                                    console.log(this.lotesData);
                                }
                            );
                            this.devolucionesService.obtenerDevoluciones(this.criteriaBusquedaDevolucionesLabs)
                                .subscribe((response: any) => {
                                    this.devolucionesLaboratorios = response || [];
                                })

                        }
                    );
                }
                else if (response.codigoProvincia == "-1") {
                    this.lotesMinLabService.obtenerLotes(this.criteriaBusquedaLotesLabs).subscribe(
                        (response: any) => {
                            this.lotesData = response || [];
                            console.log(this.lotesData);
                        }
                    );
                    this.devolucionesService.obtenerDevoluciones(this.criteriaBusquedaDevolucionesLabs)
                        .subscribe((response: any) => {
                            this.devolucionesLaboratorios = response || [];
                        });
                    this.provinciasService.obtenerLotesProvincias(this.criteriaBusquedaProvincia).subscribe(
                        (response: any) => {
                            this.lotesProvincias = response || [];
                            console.log(this.lotesProvincias);
                        },
                        (error: any) => {
                            console.log("Error obteniendo lotes provincias:", error);
                        }
                    );
                    this.lotesGeneralService.obtenerDevolucionesProvincias(this.criteriaBusqueda)
                        .subscribe((response: any) => {
                            this.lotesDevolucionesProvincias = response || []
                        },
                        (error: any) => {
                            console.log("Error obteniendo devoluciones provincias:", error);
                        });

                }

                else {
                    this.criteriaBusquedaProvincia.codigoProvincia = response.codigoProvincia;
                    this.provinciasService.obtenerLotesProvincias(this.criteriaBusquedaProvincia).subscribe(
                        (response: any) => {
                            this.lotesProvincias = response || [];
                            console.log(this.lotesProvincias);
                        },
                        (error: any) => {
                            console.log("Error obteniendo lotes provincias:", error);
                        }
                    );
                    this.lotesGeneralService.obtenerDevolucionesProvincias(this.criteriaBusquedaProvincia)
                        .subscribe((response: any) => {
                            this.lotesDevolucionesProvincias = response || []
                        },
                            (error: any) => {
                                console.log("Error obteniendo devoluciones provincias:", error);
                            });
                }
            }
        );






        this.devolucionesService.getRejectReasons()
            .subscribe((response: any) => {
                this.rejectionReasonsData = response;
            })

        this.lotesGeneralService.obtenerEmpresasTransporte()
            .subscribe((response: any) => {
                this.empresasTransporte = response;
            })


    }

    despacharLote(lote: INuevoLoteProv) {
        this.loteActual = [lote]
    }

    cambioEmpresaTransporte(evento: any) {
        this.empresaTransporteActual = parseInt(evento.target.value)
    }

    cambioCodigoSeguimiento(evento: any) {
        this.codigoSeguiminetoActual = evento.target.value
    }

    cambioFechaDevolucion(evento: any) {
        this.fechaDevolucion = evento.target.value
    }

    despacharLoteProvincia() {
        this.loteDevolucionEditado.idEmpresaTransporte = this.empresaTransporteActual;
        this.loteDevolucionEditado.codigoSeguimiento = this.codigoSeguiminetoActual;
        this.loteDevolucionEditado.fechaEnvio = this.fechaDevolucion;
        this.loteActual
        this.loteDevolucionEditado.codigoLote = this.loteActual[0].codigoLote || "",
            this.loteDevolucionEditado.codigoProvincia = this.loteActual[0].codigoProvincia || "",


            this.provinciasService.editarLoteProvincia(this.loteDevolucionEditado)
                .subscribe((response: any) => {
                    this.loteDevolucionEditado.idEmpresaTransporte = 0;
                    this.loteDevolucionEditado.codigoSeguimiento = "";
                    this.loteDevolucionEditado.fechaEnvio = "";
                    this.loteDevolucionEditado.codigoLote = "";
                    this.loteDevolucionEditado.codigoProvincia = "";

                    this.provinciasService.obtenerLotesProvincias(this.criteriaBusquedaProvincia)
                        .subscribe((response: any) => {
                            this.lotesProvincias = response
                            console.log(response)
                        })
                })

    }

    openConfirmDataModal(evento: any, lote: IDevolucionProvincia) {
        if (new Date().toISOString().slice(0, 10) < evento.target.value) {
            alert("Seleccione una fecha igual o anterior al dia actual")
        } else {
            this.myModal = document.getElementById('confirmDataChangeModal');
            if (this.myModal) {
                const modal = new Modal(this.myModal);
                this.fechaActualizacionRecibo = evento.target.value;
                this.loteActualizacionRecibo.codigoLote = lote.codigoDevolucion;
                this.loteActualizacionRecibo.fechaRecepcion = evento.target.value;
                modal.show();
            }
        }
    }

    actualizarFechaLoteAdmin() {

        this.lotesGeneralService.marcarRecepcionDevolucionProvincia(this.loteActualizacionRecibo.codigoLote + 'SEPARADOR' + this.loteActualizacionRecibo.fechaRecepcion)
            .subscribe((res: any) => {
                this.lotesGeneralService.obtenerDevolucionesProvincias(this.criteriaBusqueda)
                    .subscribe((response: any) => {
                        this.lotesDevolucionesProvincias = response
                    });
            })


        // this.lotesGeneralService.actualizarLoteAdmin(this.loteActualizacionRecibo.codigoLote 
        //     + 'SEPARADOR' + this.loteActualizacionRecibo.fechaRecepcion)
        // .subscribe((res: any) => {
        //     this.lotesMinLabService.obtenerLotes()
        //     .subscribe((response: any) => {
        //         this.lotesDataComplete = response
        //         this.lotesData = this.lotesDataComplete;
        //     });
        // });
    }
}