# chat/consumers.py
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from chat.views import save_message, GetTokenUser, NonLu

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()
        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
        self.room_group_name = f"chat_{self.room_name}"
        self.aut=False
        # Join room group
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        if self.aut==False :
            token = text_data_json["token"]
            self.token=token
            self.aut=True
        else:
            message = text_data_json["message"]
            user = text_data_json["user"]
            room = self.room_name

            USER = await GetTokenUser(self.token)
            #print(USER.id)

            if USER.username==user: #vérifie si le nom d'utilisateur correspond a celui associé au token
                # Appeler la vue en utilisant sync_to_async
                id = await save_message(room, user, message)

                # Envoyer le message au groupe
                await self.channel_layer.group_send(
                    self.room_group_name, {"type": "chat.message", "message": message, "user": user, "id":id}
                )

                #Envoyer le message au groupe de notification
                await self.channel_layer.group_send(
                    "global_notifications",{"type": "chat.message", "message": message, "user": user, "room" : self.room_name }
                )

    # Receive message from room group
    async def chat_message(self, event): 
        message = event["message"]
        user = event["user"]
        id = event["id"]
        #print('ENVOYE PAR LE SERVEUR :\n',message,'\n message envoyé à : ',self.channel_name)
        # Send message to WebSocket
        await self.send(text_data=json.dumps({"message": message,"user": user, "id":id}))

class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # accepter la connexion WebSocket pour les notifications
        await self.accept()
        # abonnement au groupe de notifications globales
        await self.channel_layer.group_add("global_notifications", self.channel_name)

    async def disconnect(self, close_code):
        # désabonnement du groupe de notifications globales à la déconnexion
        await self.channel_layer.group_discard("global_notifications", self.channel_name)

    async def receive(self, text_data):
        # Cette méthode pourrait être utilisée pour des manipulations de messages spécifiques aux notifications globales
        pass

    async def chat_message(self, event):
        #text_data_json = json.loads(text_data)
        message = event["message"]
        user = event["user"]
        room = event["room"]
        #print('\n\n',message,user,' ,room : ',room,'\n\n')
        # Cette méthode enverra des notifications aux clients connectés à la WebSocket globale
        await NonLu(room)
        await self.send(text_data=json.dumps(event))


