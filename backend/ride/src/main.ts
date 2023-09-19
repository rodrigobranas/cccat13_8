import Signup from "./application/usecase/Signup";
import GetAccount from "./application/usecase/GetAccount";
import PgPromiseAdapter from "./infra/database/PgPromiseAdapter";
import AccountDAODatabase from "./infra/repository/AccountDAODatabase";
import ExpressAdapter from "./infra/http/ExpressAdapter";
import MainController from "./infra/controller/MainController";

const connection = new PgPromiseAdapter();
const accountDAO = new AccountDAODatabase(connection);
const signup = new Signup(accountDAO);
const getAccount = new GetAccount(accountDAO);
const httpServer = new ExpressAdapter();
new MainController(httpServer, signup, getAccount);
httpServer.listen(3000);
