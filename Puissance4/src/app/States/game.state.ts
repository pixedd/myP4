import { State, Action, StateContext } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { GameCheckService } from '../Services/gameCheckService/game-check.service'


export const GRID_WIDTH: number = 7;
export const GRID_HEIGHT: number = 6;
export const GRID_SIZE: number = GRID_WIDTH * GRID_HEIGHT;

export class InitGameGrid {
    static readonly type = '[Game] InitCoinsInGrid'
    constructor() { }
}

export class Play {
    static readonly type = '[Game] PerformActionForPlayerTurn'
    constructor(public colIndex: number) { }
}

export interface GameStateModel {
    gridContent: Array<number>;
    lastCoinPlaced: number;
    player: number;
}

@State<GameStateModel>({
    name: 'grid',
    defaults: {
        gridContent: Array<number>(),
        lastCoinPlaced: -1,
        player: 1,
    }
})
@Injectable()
export class GameState {
    @Action(InitGameGrid)
    initGameGrid(ctx: StateContext<GameStateModel>) {
        const state = ctx.getState();
        ctx.setState({
            ...state,
            gridContent: new Array(GRID_SIZE).fill(0),
        })
    }
    @Action(Play)
    play(ctx: StateContext<GameStateModel>, action: Play) {
        const state = ctx.getState();
        let colIndex: number = action.colIndex;
        let grid: Array<number> = Array<number>();
        let placed = [false, -1];
        let player = state.player;
        state.gridContent.forEach((gridTile: number, index: number) => {
            // Le bas du tableau étant les cases aux indexes les plus hauts,
            // on ne soucie pas de savoir si un bon emplacement à été trouvé plus bas.
            // ainsi l'algo enregistre qu'il doit ajouter le jeton à la case vide troucée
            // la plus basse.
            if (index % GRID_WIDTH === colIndex && gridTile === 0) {
                placed[1] = index;
                placed[0] = true;
            }
            grid.push(gridTile);
        })
        if (placed[0]) {
            console.log("coin placed in tile index : " + placed[1]);
            grid[placed[1] as number] = player;
            switch (player) {
                case 1:
                    player = 2;
                    break;
                case 2:
                    player = 1;
                    break;
            }
            ctx.setState({
                ...state,
                gridContent: grid,
                player: player,
                lastCoinPlaced: placed[1] as number,
            })
        }
    }
}