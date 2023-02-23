export interface IRoles{
    nroRol: number;
    nombreRol: RolNombre;
}

enum RolNombre {
    ROL_ADMIN, ROL_PROV, ROL_LAB
}