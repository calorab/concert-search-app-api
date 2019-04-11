exports.DATABASE_URL = process.env.DATABASE_URL || global.DATABASE_URL || 'mongodb+srv://admin:12345@cluster0-6akq9.mongodb.net/test?retryWrites=true';

// -------need to update this with the correct link if this isn't right-------
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL ||
    'mongodb+srv://admin:12345@cluster0-6akq9.mongodb.net/test?retryWrites=true';
exports.PORT = process.env.PORT || 8080;

//per Dirk - notes
//export.API_ENDPOINT=''

//-------
//JSON response for artist search:
//{
//    "resultsPage": {
//        "status": "ok",
//            "results": {
//                "artist": [
//                    {
//                        "id": 422377,
//                        "displayName": "Cher",
//                        "uri": "http://www.songkick.com/artists/422377-cher?utm_source=54847&utm_medium=partner",
//                        "identifier": [
//                            {
//                                "mbid": "bfcc6d75-a6a5-4bc6-8282-47aec8531818",
//                                "href": "http://api.songkick.com/api/3.0/artists/mbid:bfcc6d75-a6a5-4bc6-8282-47aec8531818.json",
//                                "eventsHref": "http://api.songkick.com/api/3.0/artists/mbid:bfcc6d75-a6a5-4bc6-8282-47aec8531818/calendar.json",
//                                "setlistsHref": "http://api.songkick.com/api/3.0/artists/mbid:bfcc6d75-a6a5-4bc6-8282-47aec8531818/setlists.json"
//                            }
//                        ],
//                        "onTourUntil": "2019-12-19"
//                    }
//API URL: (for Cher)
//https://api.songkick.com/api/3.0/search/artists.json?apikey=ZOV7FltnOvfdD7o9&query=cher


//JSON response: (concert search)
//{
//    "resultsPage": {
//        "status": "ok",
//            "results": {
//                "event": [
//                    {
//                        "id": 35263944,
//                        "displayName": "Cher and Nile Rodgers at PPG Paints Arena (April 18, 2019)",
//                        "type": "Concert",
//                        "uri": "http://www.songkick.com/concerts/35263944-cher-at-ppg-paints-arena?utm_source=54847&utm_medium=partner",
//                        "status": "ok",
//                        "popularity": 0.0829,
//                        "start": {
//                            "date": "2019-04-18",
//                            "datetime": "2019-04-18T19:30:00-0400",
//                            "time": "19:30:00"
//                        },
//                        "performance": [
//                            {
//                                "id": 67513199,
//                                "displayName": "Cher",
//                                "billing": "headline",
//                                "billingIndex": 1,
//                                "artist": {
//                                    "id": 422377,
//                                    "displayName": "Cher",
//                                    "uri": "http://www.songkick.com/artists/422377-cher?utm_source=54847&utm_medium=partner",
//                                    "identifier": [
//                                        {
//                                            "mbid": "bfcc6d75-a6a5-4bc6-8282-47aec8531818",
//                                            "href": "http://api.songkick.com/api/3.0/artists/mbid:bfcc6d75-a6a5-4bc6-8282-47aec8531818.json"
//                                        }
//                                    ]
//                                }
//                            },
//                            {
//                                "id": 67603284,
//                                "displayName": "Nile Rodgers",
//                                "billing": "headline",
//                                "billingIndex": 2,
//                                "artist": {
//                                    "id": 512601,
//                                    "displayName": "Nile Rodgers",
//                                    "uri": "http://www.songkick.com/artists/512601-nile-rodgers?utm_source=54847&utm_medium=partner",
//                                    "identifier": [
//                                        {
//                                            "mbid": "c6d571dd-c0ae-4ac8-9500-780b1b9b25e5",
//                                            "href": "http://api.songkick.com/api/3.0/artists/mbid:c6d571dd-c0ae-4ac8-9500-780b1b9b25e5.json"
//                                        }
//                                    ]
//                                }
//                            }
//                        ],
//                        "ageRestriction": null,
//                        "flaggedAsEnded": false,
//                        "venue": {
//                            "id": 922176,
//                            "displayName": "PPG Paints Arena",
//                            "uri": "http://www.songkick.com/venues/922176-ppg-paints-arena?utm_source=54847&utm_medium=partner",
//                            "metroArea": {
//                                "displayName": "Pittsburgh",
//                                "country": {
//                                    "displayName": "US"
//                                },
//                                "state": {
//                                    "displayName": "PA"
//                                },
//                                "id": 22443,
//                                "uri": "http://www.songkick.com/metro_areas/22443-us-pittsburgh?utm_source=54847&utm_medium=partner"
//                            },
//                            "lat": 40.43959,
//                            "lng": -79.98894
//                        },
//                        "location": {
//                            "city": "Pittsburgh, PA, US",
//                            "lat": 40.43959,
//                            "lng": -79.98894
//                        }
//                    }
