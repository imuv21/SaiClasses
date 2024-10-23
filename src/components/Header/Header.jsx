import './Header.scss';
import React, { useState, useEffect, Fragment } from 'react';
import { toast } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logoutUser, deleteUser } from '../../slices/authSlice';

import EastIcon from '@mui/icons-material/East';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import VerifiedIcon from '@mui/icons-material/Verified';
import NewReleasesIcon from '@mui/icons-material/NewReleases';


const Header = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.user);
    const [isHovered, setIsHovered] = useState(false);

    const logout = async (e) => {
        e.preventDefault();
        try {
            const response = await dispatch(logoutUser()).unwrap();
            toast(<div className='flex center g5'> < VerifiedIcon /> {response.message}</div>, { duration: 3000, position: 'top-center', style: { color: 'rgb(0, 189, 0)' }, className: 'success', ariaProps: { role: 'status', 'aria-live': 'polite' } });
        } catch (error) {
            toast(<div className='flex center g5'> < NewReleasesIcon /> Error logging out...</div>, { duration: 3000, position: 'top-center', style: { color: 'red' }, className: 'failed', ariaProps: { role: 'status', 'aria-live': 'polite' } });
        } finally {
            navigate('/login');
        }
    }

    const deleteAccount = async (e) => {
        e.preventDefault();
        try {
            const deleteResponse = await dispatch(deleteUser({ email: user.email, password: user.password })).unwrap();
            if (deleteResponse.status === 'success') {
                toast(<div className='flex center g5'> < VerifiedIcon /> {deleteResponse.message}</div>, { duration: 3000, position: 'top-center', style: { color: 'rgb(0, 189, 0)' }, className: 'success', ariaProps: { role: 'status', 'aria-live': 'polite' } });
                await logout();
            } else {
                toast(<div className='flex center g5'> < NewReleasesIcon /> {deleteResponse.message}</div>, { duration: 3000, position: 'top-center', style: { color: 'red' }, className: 'failed', ariaProps: { role: 'status', 'aria-live': 'polite' } });
            }
        } catch (error) {
            toast(<div className='flex center g5'> < NewReleasesIcon /> Error deleting account...</div>, { duration: 3000, position: 'top-center', style: { color: 'red' }, className: 'failed', ariaProps: { role: 'status', 'aria-live': 'polite' } });
        }
    }

    useEffect(() => {
        const navbarMenu = document.getElementById("menu");
        const burgerMenu = document.getElementById("burger");
        const headerMenu = document.getElementById("header");

        const handleBurgerClick = () => {
            burgerMenu.classList.toggle("is-active");
            navbarMenu.classList.toggle("is-active");
        };

        const handleLinkClick = () => {
            burgerMenu.classList.remove("is-active");
            navbarMenu.classList.remove("is-active");
        };

        const handleScroll = () => {
            if (window.scrollY >= 85) {
                headerMenu.classList.add("on-scroll");
            } else {
                headerMenu.classList.remove("on-scroll");
            }
        };

        const handleResize = () => {
            if (window.innerWidth > 768 && navbarMenu.classList.contains("is-active")) {
                navbarMenu.classList.remove("is-active");
            }
        };

        burgerMenu.addEventListener("click", handleBurgerClick);

        document.querySelectorAll(".menu-link").forEach((link) => {
            link.addEventListener("click", handleLinkClick);
        });

        window.addEventListener("scroll", handleScroll);
        window.addEventListener("resize", handleResize);

        return () => {
            burgerMenu.removeEventListener("click", handleBurgerClick);
            document.querySelectorAll(".menu-link").forEach((link) => {
                link.removeEventListener("click", handleLinkClick);
            });
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <Fragment>
            <header className="header" id="header">
                <nav className="navbar container">
                    <div className='headerBox'>
                        <div className="burger" id="burger">
                            <span className="burger-line"></span>
                            <span className="burger-line"></span>
                            <span className="burger-line"></span>
                        </div>
                        <a href="/" className="brand"><img src="https://res.cloudinary.com/dfsohhjfo/image/upload/v1729601762/SaiClasses/Assets/Picsart_24-10-22_14-56-04-199_puxs2n.png" alt="JustDate" /></a>
                    </div>

                    <div className="menu" id="menu">
                        <ul className="menu-inner">
                            <li className="menu-item"><a href="/discover" className="menu-link">Discover</a></li>
                            <li className="menu-item"><a href="/about-us" className="menu-link">About us</a></li>
                            <li className="menu-item"><a href="/contact-us" className="menu-link">Contact us</a></li>
                            <li className="menu-item">
                                <a href="/profile" className="menu-link main-div" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
                                    Account <KeyboardArrowDownIcon />
                                    <div className={`hover-div ${isHovered ? 'visible' : ''}`}>
                                        <a href='/profile' className='text'>Profile</a>
                                        <a href="/videos" cclassName='text'>Videos</a>
                                        <a href="/payment" className='text'>Payment</a>
                                        <a onClick={logout} className='text'>Logout</a>
                                        <a onClick={deleteAccount} className='text'>Delete Account</a>
                                    </div>
                                </a>
                            </li>
                            <li className="menu-item mlink"><a href="/profile" className="menu-link">Profile</a></li>
                            <li className="menu-item mlink"><a href="/videos" className="menu-link">Videos</a></li>
                            <li className="menu-item mlink"><a href="/payment" className="menu-link">Payment</a></li>
                            <li className="menu-item mlink"><a onClick={logout} className="menu-link">Logout</a></li>
                            <li className="menu-item mlink"><a onClick={deleteAccount} className="menu-link">Delete Account</a></li>
                        </ul>
                    </div>

                    {!user && <a href="/contact-us" className="menu-block">Sign up &nbsp;&nbsp; <EastIcon /></a>}
                </nav>
            </header>
        </Fragment>
    )
};

export default Header;