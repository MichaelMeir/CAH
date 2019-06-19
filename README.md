# CAH
School project to recreate Cards Against Humanity as a web application

#### API calls

Name|URL|Description|Method|Required
---|---|---|---|---
SetNickname|/api/user/setNickname|Sets the nickname of a user|POST|{nickname:string}
GetRoomInfo|/api/room/info|Gets information about the room|GET|{roomId:uuid}
SetRoomInfo|/api/room/info|Sets information about the room|POST|{roomId:uuid}


#### Socket calls

Client -> Server
Name|Description|Required
---|---|---
JoinRoom|Joins user to the room given|{roomId:uuid}
LeaveRoom|Leaves user from the room given|{roomId:uuid}
PlayCard|Plays specific card that the user selected|{cardId:uuid}


Server -> Client
Name|Description|Required
---|---|---
Chat|Sends a message to display in the chat|{message:string, user:object}
Cards|Sends user his own cards to display|{cards:[Object]}
PlayedCards|Sends user the played cards when they get revealed|{cards:[Object]}
HiddenCards|Sends user how many hidden cards to display|{cards:int}
BlackCard|Sends user the black card|{card:Object}
RoundInfo|Sends info about the winner and current starting round|{round:Object}