import express, { Router } from 'express';
import { isUserAuthenticated, isUserNotAuthenticated } from '../auth/passport_middleware.js';
import UserSettingsService from '../services/UserSettingsService.js';
import { CustomRequest, CustomResponse } from '../ts/interfaces.js';

const userSettingsService = new UserSettingsService();

export default class UserSettingsController {

    userSettingsService: UserSettingsService;

    constructor() { 
        this.userSettingsService = new UserSettingsService();
    }

    getSettings = (req: CustomRequest, res: CustomResponse) => {
        return this.userSettingsService.getSettings(req, res);
    }

    updateSettings = (req: CustomRequest, res: CustomResponse) => {
        return this.userSettingsService.updateSettings(req, res);
    }
}
