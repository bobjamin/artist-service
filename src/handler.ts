import { ApiGatewayEvent, ApiGatewayContext } from "./lambda-events/lambda-events";
import ArtistService from "./artists/artist-service";
import Artist from "./artists/artist";
import * as AWS from 'aws-sdk';

export const artistHandler = (event: ApiGatewayEvent, context: ApiGatewayContext): void => {
    let artistService = new ArtistService(new AWS.DynamoDB.DocumentClient({region: 'eu-west-1'}), process.env.TABLE_NAME);
    if(event.path === "/artists"){
        if(event.httpMethod === "GET"){
            artistService.get().then((artists) => {
                context.done(null, {statusCode:200, body:JSON.stringify(artists), headers: {'Access-Control-Allow-Origin': '*'}})
            });
        }
        else if(event.httpMethod === "POST"){
            artistService.add(<Artist>JSON.parse(event.body)).then(() => {
                context.done(null, {statusCode:200, body:'Artist Added', headers: {'Access-Control-Allow-Origin': '*'}})
            });
        }
    }
};

