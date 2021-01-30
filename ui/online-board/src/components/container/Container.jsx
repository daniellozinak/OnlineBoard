import React,{lazy,Suspense}  from 'react';
import { BrowserRouter,Route, Switch } from 'react-router-dom';
import './style.css';

const Board = lazy(()=> {return import('../board/Board')});
const TopBar = lazy(()=>{return import('../TopBar/Topbar')});
const Login = lazy(()=>{return import('../login/Login')});
const Register = lazy(()=>{return import('../register/Register')});
const Home = lazy(()=>{return import('../home/Home')});

class Container extends React.Component{

    renderLoader()
    {
        return <p>loading...</p>
    }

    render()
    {
        return(
            <div className="container">
                <Suspense fallback={this.renderLoader()}>
                    <BrowserRouter>
                        <TopBar draw-path="/draw" login-path="/login" register="/register"/>
                        <Switch>
                            <Route path='/draw' exact component={Board}/>
                            <Route path='/login' exact component={Login}/>
                            <Route path='/register' exact component={Register}/>
                            <Route path='/' exact component={Home}/>
                            <Route path="/" render={()=><div>404</div>}/>
                        </Switch>
                    </BrowserRouter>
                </Suspense>
            </div>

        )
    }
}

export default Container;