import Link from 'next/link';

export default function Nav() {
    return (
        <ul className="nav nav-tabs bg-primary">
            <li className="nav-item">
                <Link href="/">
                    <a className="nav-link text-light">Home</a>
                </Link>
            </li>
            <li className="nav-item">
                <Link href="/login">
                    <a className="nav-link text-light">Login</a>
                </Link>
            </li>
            <li className="nav-item">
                <Link href="/register">
                    <a className="nav-link text-light">Register</a>
                </Link>
            </li>
        </ul>
    )
}