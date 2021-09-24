/* eslint-disable import/no-anonymous-default-export */
import Commentators from "./Commentators";
import instance from './instance';
import LastAccounts from "./LastAccounts";

export default {
    commentatorsModule: Commentators(instance),
    last_accounts:LastAccounts(instance)
}