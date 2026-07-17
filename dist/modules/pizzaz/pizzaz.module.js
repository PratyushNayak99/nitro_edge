var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nitrostack/core';
import { PizzazService } from './pizzaz.service.js';
import { PizzazTools } from './pizzaz.tools.js';
import { PizzazTaskTools } from './pizzaz.tasks.js';
let PizzazModule = class PizzazModule {
};
PizzazModule = __decorate([
    Module({
        name: 'pizzaz',
        description: 'Pizza shop finder module',
        controllers: [PizzazTools, PizzazTaskTools],
        providers: [PizzazService],
    })
], PizzazModule);
export { PizzazModule };
//# sourceMappingURL=pizzaz.module.js.map