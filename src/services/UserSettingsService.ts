import UserDTO from "../dto/UserDTO.js";
import SettingsRepositoryRedis from "../repository/SettingsRepositoryRedis.js";
import SettingsRepositoryPostgres from "../repository/SettingsRepositoryPostgres.js";
import { CustomRequest, CustomResponse } from "../ts/interfaces";


export default class UserSettingsService {

    settingsRepositoryRedis: SettingsRepositoryRedis;
    settingsRepositoryPostgres: SettingsRepositoryPostgres;

    constructor() {
        this.settingsRepositoryRedis = new SettingsRepositoryRedis();
        this.settingsRepositoryPostgres = new SettingsRepositoryPostgres();
    }

    
    getSettings = async (req: CustomRequest, res: CustomResponse) => {
        
        // get user data and current design settings/preferences from session
        const userDTO: UserDTO = new UserDTO(req.session.passport.user);

        // first check if there are card design templates cached in redis
        let cardFaceDesigns: string[] | undefined = await this.settingsRepositoryRedis.getCardFaceDesigns();
        let cardBackDesigns: string[] | undefined = await this.settingsRepositoryRedis.getCardBackDesigns();

        // if there are no design templates cached - get them from database
        if (!cardFaceDesigns || cardFaceDesigns.length === 0) {
            cardFaceDesigns = await this.settingsRepositoryPostgres.getCardFaceDesigns();
        }
        if (!cardBackDesigns || cardBackDesigns.length === 0) {
            cardBackDesigns = await this.settingsRepositoryPostgres.getCardBackDesigns();
        }

        // render user settings page 
        // or redirect to homepage if no settings are found in cache or database
        if (cardFaceDesigns && cardBackDesigns) {
            res.render('user-settings', {
                userdata: userDTO,
                cardFaceDesigns: cardFaceDesigns,
                cardBackDesigns: cardBackDesigns
            });
        } else {
            res.redirect('/');
        }   
    }

    updateSettings = async (req: CustomRequest, res: CustomResponse) => {

        // get user id from session
        const userId = req.session.passport.user.id;

        // get submitted ids from request body and parse them to integer
        let cardface = parseInt(req.body.cardface, 10);
        let cardback = parseInt(req.body.cardback, 10);

        // if they are not valid set them to 1
        if(isNaN(cardface)) { cardface = 1; }
        if(isNaN(cardback)) { cardback = 1; }

        // update user in database
        const queryResult: boolean = await this.settingsRepositoryPostgres.updateCardBackDesigns(cardface, cardback, userId);
        
        if (queryResult) {
            // update user's session
            req.session.passport.user.cardface_design_id = cardface;
            req.session.passport.user.cardback_design_id = cardback;
            req.flash('success', 'User settings saved.');
        } else {
            req.flash('error', 'Error updating user settings.');
        }

        res.redirect('/user-settings');
    }

}