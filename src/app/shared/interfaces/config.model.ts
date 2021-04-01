import { Directions } from "../enums/directions.enum";

export interface IConfig {
    initialOrientation: Directions
​    numberOfSquares: number
​    obstacles: number
    xCoordinate: number
    yCoordinate: number
}