/*
{
    "subject": "acct:flq@freiburg.social",
    "aliases": [
        "https://freiburg.social/@flq",
        "https://freiburg.social/users/flq"
    ],
    "links": [
        {
            "rel": "http://webfinger.net/rel/profile-page",
            "type": "text/html",
            "href": "https://freiburg.social/@flq"
        },
        {
            "rel": "self",
            "type": "application/activity+json",
            "href": "https://freiburg.social/users/flq"
        },
        {
            "rel": "http://ostatus.org/schema/1.0/subscribe",
            "template": "https://freiburg.social/authorize_interaction?uri={uri}"
        }
    ]
}
*/

export default function WebFinger() {
    return "{\r\n    \"subject\": \"acct:flq@freiburg.social\",\r\n    \"aliases\": [\r\n        \"https://freiburg.social/@flq\",\r\n        \"https://freiburg.social/users/flq\"\r\n    ],\r\n    \"links\": [\r\n        {\r\n            \"rel\": \"http://webfinger.net/rel/profile-page\",\r\n            \"type\": \"text/html\",\r\n            \"href\": \"https://freiburg.social/@flq\"\r\n        },\r\n        {\r\n            \"rel\": \"self\",\r\n            \"type\": \"application/activity+json\",\r\n            \"href\": \"https://freiburg.social/users/flq\"\r\n        },\r\n        {\r\n            \"rel\": \"http://ostatus.org/schema/1.0/subscribe\",\r\n            \"template\": \"https://freiburg.social/authorize_interaction?uri={uri}\"\r\n        }\r\n    ]\r\n}"
}