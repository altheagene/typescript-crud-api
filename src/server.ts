import express, {Application} from 'express';
import cors from 'cors';
import { errorHandler } from './_middleware/errorHandler';
import { initialize } from './_helpers/db';
import usersController from './users/users.controller';
import employeesController from './employees/employee.controller';
import departmentsController from './departments/department.controller';
import requestsController from './requests/request.controller'
import requestItemController from './requestItems/requestItem.controller'

const app: Application = express();

//Middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());

//API Routes
app.use('/users', usersController);
app.use('/employees', employeesController);
app.use('/departments', departmentsController);
app.use('/requests', requestsController);
app.use('/requestItems', requestItemController)

//Global Error Handler (must be last)
app.use(errorHandler);

app.get('/ping', (req, res) => {
  res.send("pong");
});
//Start server + initialize database
const PORT = process.env.PORT || 4000;

initialize()
    .then(() => {
       app.listen(PORT, () => {
         console.log(`Server running on http://localhost:${PORT}`);
        console.log(`Test with: POST /users with {email, password, ...}`);
       });
    })
    .catch((err) => {
        console.error('Failed to initialize database:', err);
        process.exit(1);
    });