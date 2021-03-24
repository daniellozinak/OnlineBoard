import React,{lazy,Suspense}  from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import './style.css';

const Board = lazy(()=> {return import('../board/Board')});
const TopBar = lazy(()=>{return import('../TopBar/Topbar')});
const Home = lazy(()=>{return import('../home/Home')});

class Container extends React.Component{

    constructor(props)
    {
        super(props);
        this.boardRef = React.createRef();
    }

    componentDidMount()
    {

    }

    onRefChange = r =>{
        if(r) 
        {
            r.join(this.props.history.location.pathname);
            //this.props.history.push('/draw');
        }
    }

    renderLoader()
    {
        return <p>loading...</p>
    }

    render()
    {
        return(
            <div className="container-fluid">{this.props.children}
                <Suspense fallback={this.renderLoader()}>
                        <TopBar/>
                        <Switch>
                            <Route path='/draw' component={() => {return <Board ref={this.onRefChange} />}}/>
                            <Route path='/' exact component={Home}/>
                            <Route path="/" render={()=><div>404</div>}/>
                        </Switch>
                </Suspense>
            </div>

        )
    }
}

export default withRouter(Container);