import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
import { GetUser, EditUser } from './services/userService.js';
import { consumeMessages } from './services/rabbitmqListener.js';

const packageDefinition = protoLoader.loadSync('./protos/user.proto',{
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});

const userProto = grpc.loadPackageDefinition(packageDefinition).UserService;

const server = new grpc.Server();

server.addService(userProto.service,{ GetUser, EditUser });

const PORT = process.env.PORT || 50051;

const exchange = 'user-exchange';
const routingKey = 'user.added';
consumeMessages(exchange, routingKey);

server.bindAsync(`${process.env.GRPC_URL}:${PORT}`,grpc.ServerCredentials.createInsecure(),
    (err,port) => {
        if(err) {
            console.error(err)
            return;
        }
        console.log(`UserService gRPC server running at http://localhost:${port}`);
    }
)