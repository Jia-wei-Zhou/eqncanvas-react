export interface Point {
    x: number;
    y: number;
}

export interface Stroke {
    points: Point[];
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
}