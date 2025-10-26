import {Request, Response} from 'express'

export const createProduct = (req:Request, res:Response) => {

    res.json('desde POST thunder')
}

/*
- Estas funciones reemplazan req, res de router.ts por eso las importamos de Express para tener autocompletado de Ts y no tener any




*/