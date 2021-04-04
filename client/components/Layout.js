import Nav from './Nav';
export default function Layout({children}) {
    return (
        <div>
            <Nav/>
            <div className="container pt-5 pb-5">
                {children}
            </div>
        </div>
    )
}