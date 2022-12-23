import {
  Avatar,
  Box,
  Button,
  Grid,
  GridItem,
  HStack,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Stack,
  Text,
  useToast,
  Center,
  Icon,
} from '@chakra-ui/react';
import { IoMdCart } from 'react-icons/io';
import { BiLogOutCircle } from 'react-icons/bi';
import {
  Link,
  useNavigate,
  createSearchParams,
  useSearchParams,
  useLocation,
} from 'react-router-dom';
import logo from '../assets/LogoDelisha.18.02.jpeg';
// import emptyCart from "../assets/emptyCart.png";
import { BiSearch } from 'react-icons/bi';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/features/authSlice';
import { IoIosNotifications } from 'react-icons/io';
import { IoIosAlert } from 'react-icons/io';
import { GiHamburgerMenu } from 'react-icons/gi';
import { useState } from 'react';
import { useEffect } from 'react';
import { fillCart } from '../redux/features/cartSlice';
import { axiosInstance } from '../api';
// import status1 from "../assets/transactionStatusLogo/awaiting.png";
// import status2 from "../assets/transactionStatusLogo/processed2.png";
// import status3 from "../assets/transactionStatusLogo/Delivered.png";
// import status4 from "../assets/transactionStatusLogo/Shipping.png";
import { RiSearchEyeFill } from 'react-icons/ri';
import { CgRemote } from 'react-icons/cg';
import { MdOutlineNotificationsActive } from 'react-icons/md';
import { SiClockify } from 'react-icons/si';
import { FcProcess } from 'react-icons/fc';
import { TbTruckDelivery } from 'react-icons/tb';
import { BsBagCheckFill } from 'react-icons/bs';
import { MdShoppingCart, MdOutlineAddShoppingCart } from 'react-icons/md';

const Navbar = ({ onChange, onClick, onKeyDown }) => {
  const authSelector = useSelector((state) => state.auth);
  const [searchValue, setSearchValue] = useState('');
  const [searchParam, setSearchParam] = useSearchParams();
  const cartSelector = useSelector((state) => state.cart);
  const [showCategory, setShowCategory] = useState([]);
  const [totalCartQuantity, setTotalCartQuantity] = useState(0);
  const [cartData, setCartData] = useState([]);

  const dispatch = useDispatch();
  const toast = useToast();
  const navigate = useNavigate();
  const apiImg = process.env.REACT_APP_IMAGE_URL;
  const location = useLocation();

  const refreshPage = () => {
    window.location.reload(false);
  };

  const fetchMyCart = async () => {
    try {
      const response = await axiosInstance.get('/carts/me');
      dispatch(fillCart(response.data.data));
      setCartData(response.data.data);

      const cartQuantity = response.data.data.map((val) => val.quantity);

      let Total = 0;

      for (let i = 0; i < cartQuantity.length; i++) {
        Total += Number(cartQuantity[i]);
      }

      setTotalCartQuantity(Total);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchCategory = async () => {
    try {
      const response = await axiosInstance.get('/categories');
      setShowCategory(response.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const renderCategory = () => {
    return showCategory.map((val) => {
      return (
        <Text
          _hover={{
            bgColor: '#A5D8F8',
            borderRadius: '5px',
          }}
          p="5px"
        >
          {val.category_name}
        </Text>
      );
    });
  };

  const logoutBtnHandler = () => {
    localStorage.removeItem('auth_token');
    dispatch(logout());

    toast({
      title: 'User Logout',
      status: 'info',
    });

    if (
      location.pathname === '/cart' ||
      location.pathname === '/transaction' ||
      location.pathname === '/user/profile' ||
      location.pathname === '/user/profile/change-password' ||
      location.pathname === '/user/profile/address'
    ) {
      navigate('/login');
      refreshPage();
    } else {
      refreshPage();
    }
  };

  const changeBtnHandler = (e) => {
    setSearchValue(e.target.value);
    onChange(e);
  };

  const keyDownBtnHandler = (e) => {
    if (e.key === 'Enter') {
      navigate({
        pathname: '/product',
        search: createSearchParams({
          name: searchValue,
        }).toString(),
      });
      onKeyDown(e);
    }
  };

  const renderCartNavbar = () => {
    return cartData.map((val) => {
      return (
        <>
          <Link to={'/cart'}>
            <Box h={'1px'} bgColor={'#fcd4a5'} mt={'-2px'} />
            <Box
              display={'flex'}
              flexDirection={'row'}
              mt={'15px'}
              pl={'10px'}
              pr={'10px'}
              pb={'13px'}
            >
              <Image
                src={val.Product.Image_Urls[0].image_url}
                h={'35px'}
                w={'35px'}
              />
              <Box pl={'10px'}>
                <Text
                  fontWeight={600}
                  fontSize={'14px'}
                  whiteSpace={'nowrap'}
                  overflow={'hidden'}
                  textOverflow={'ellipsis'}
                  width={'200px'}
                  fontColor={'#31353BF5'}
                  fontFamily={'Open Sauce One,Nunito Sans, sans-serif'}
                  _hover={{
                    color: 'blue',
                  }}
                >
                  {val.Product.product_name}
                </Text>
                <Text
                  fontWeight={400}
                  fontSize={'12px'}
                  width={'180px'}
                  fontColor={'#31353BF5'}
                  fontFamily={'Open Sauce One,Nunito Sans, sans-serif'}
                >
                  {val.quantity} {val.quantity > 1 ? 'items' : 'item'}
                </Text>
              </Box>
            </Box>
            <Box>
              <Text
                pl={'3px'}
                fontFamily={'Open Sauce One,Nunito Sans, sans-serif'}
                fontWeight={700}
                fontSize={'15px'}
                color={'#F7931E'}
                mt={'-42px'}
                textAlign={'right'}
                pb={'20px'}
                mr={'8px'}
              >
                {
                  new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                  })
                    .format(val.Product.price)
                    .split(',')[0]
                }
              </Text>
            </Box>
          </Link>
        </>
      );
    });
  };

  useEffect(() => {
    setSearchValue(searchParam.get('name'));
  }, []);

  useEffect(() => {
    fetchMyCart();
    fetchCategory();
  }, [cartData, authSelector]);

  return (
    <>
      <Box
        boxShadow={'rgba(0, 0, 0, 0.24) 0px 3px 8px'}
        position={'fixed'}
        left="0"
        right={'0'}
        top="0"
        backgroundColor={"#EEEEEE"}
        zIndex="9998"
      >
        <Box backgroundColor="#fcfcfc">
          <HStack height={'90px'} width={'98%'} mx={'auto'} spacing={5}>
            {/* Logo */}
            <Link to={'/'}>
              <CgRemote color={'#0095DA'} fontSize={70} />
            </Link>
            <Link to={'/'}>
              <Text
                fontSize={'30px'}
                fontWeight="bold"
                color={'#0095DA'}
                display="inline"
                ml={'-25px'}
              >
                DeLisHa
              </Text>
            </Link>
            {/* Category */}
            {/* <Popover trigger="hover">
              <PopoverTrigger>
                <Box pr={"1px"} pl={"10px"} cursor={"pointer"}>
                  <Text
                    my={"auto"}
                    fontSize="28px"
                    fontWeight="semibold"
                    p="15px"
                    pr={"17px"}
                    pt={"8x"}
                    color={"#878787"}
                    _hover={{
                      color: "#0095DA",
                    }}
                  >
                    <GiHamburgerMenu />
                  </Text>
                </Box>
              </PopoverTrigger>
              <PopoverContent
                w={"100%"}
                mt="-10px"
                bgColor={"#E5F9F6"}
                borderRadius={"5px"}
              >
                <PopoverBody fontWeight={"bold"} fontSize="14px">
                  <Grid
                    templateColumns="1fr"
                    gap="6"
                    width={"180px"}
                    height={"400px"}
                    overflow={"auto"}
                    cursor={"pointer"}
                  >
                    <GridItem>{renderCategory()}</GridItem>
                  </Grid>
                </PopoverBody>
              </PopoverContent>
            </Popover> */}

            {/* Search*/}
            <Box w={'100%'} display={'flex'} justifyContent={'flex-end'}>
              <Box w={'96%'}>
                <InputGroup>
                  <Input
                    placeholder="Search in Delisha"
                    _placeholder={{ fontSize: '16px' }}
                    bgColor={'#fff'}
                    border={'2px solid #FFD7B1'}
                    borderRadius={'15px'}
                    onChange={changeBtnHandler}
                    onKeyDown={keyDownBtnHandler}
                    value={searchValue}
                  />
                  <InputRightElement width="3.5rem" mr={'-5px'}>
                    <Button
                      borderLeftRadius="0"
                      _hover={{ bgColor: 'none' }}
                      size={'35px'}
                      h={'30px'}
                      bgColor={'#fff'}
                      mr={'9px'}
                      borderRadius={'15px'}
                    >
                      <RiSearchEyeFill fontSize={'20px'} color={'#0095DA'} />
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </Box>
            </Box>

            {/* Notif */}
            {authSelector.id ? (
              <Box
                display={'flex'}
                gap="4"
                fontSize="14px"
                fontWeight={'semibold'}
                cursor={'pointer'}
              >
                <Box
                  display={'flex'}
                  my="auto"
                  gap={2}
                  paddingRight={1}
                  color="#6c727c"
                >
                  <Popover trigger="hover">
                    <PopoverTrigger>
                      <Box pl={'10px'} mr={'-12px'}>
                        <Stack
                          p={2}
                          _hover={{
                            color: '#0095DA',
                          }}
                        >
                          <MdOutlineNotificationsActive fontSize={'25px'} />
                        </Stack>
                      </Box>
                    </PopoverTrigger>
                    <PopoverContent
                      //   bgColor={"#E5F9F6"}
                      width={'400px'}
                      height={'270px'}
                      borderRadius={'20px'}
                    >
                      <Box boxShadow={'rgba(0, 0, 0, 0.05) 0px 3px 8px'}>
                        <PopoverHeader
                          display={'flex'}
                          justifyContent="space-between"
                          pt={'10px'}
                          pb={'10px'}
                        >
                          <Text fontSize={'17px'}>Notification</Text>
                          {/* <Box fontSize={"21px"}>
                            <IoIosAlert />
                          </Box> */}
                        </PopoverHeader>
                      </Box>
                      <PopoverBody>
                        <Box
                          display={'flex'}
                          justifyContent={'space-between'}
                          pb={'7px'}
                          pt={'5px'}
                        >
                          <Text
                            fontSize={'15px'}
                            fontWeight={600}
                            ml={'10px'}
                            // fontFamily={
                            //   "Open Sauce One,Nunito Sans, sans-serif"
                            // }
                          >
                            Transaction
                          </Text>
                          <Link to={'/transaction'}>
                            <Text
                              color={'#0095DA'}
                              fontSize={'12px'}
                              mt={'10px'}
                              mb={'-5px'}
                              fontFamily={
                                'Open Sauce One,Nunito Sans, sans-serif'
                              }
                            >
                              See All
                            </Text>
                          </Link>
                        </Box>
                        <Box display={'flex'} dir={'row'}>
                          <Box
                            width={'400px'}
                            bgColor={'#0095DA'}
                            h={'3px'}
                            mb={'7px'}
                          />
                        </Box>
                        <Box pl={'8px'} pr={'8px'}>
                          <Box
                            fontSize={'13px'}
                            fontWeight={400}
                            mt={'7px'}
                            fontFamily={
                              'Open Sauce One,Nunito Sans, sans-serif'
                            }
                          >
                            Transaction Status
                          </Box>
                          <Grid
                            templateColumns="repeat(4, 1fr)"
                            gap={'4px'}
                            mt={'15px'}
                            display={'flex'}
                            justifyContent={'space-between'}
                          >
                            <GridItem w="70px" h="10" alignItems={'center'}>
                              <Icon
                                margin={'auto'}
                                w={'47px'}
                                h={'47px'}
                                ml={'15px'}
                              >
                                <SiClockify color={'#F70000'} fontSize={20} />
                              </Icon>

                              <Text
                                mt={'8px'}
                                textAlign={'center'}
                                fontSize={'12px'}
                                fontWeight={400}
                                fontFamily={
                                  'Open Sauce One,Nunito Sans, sans-serif'
                                }
                              >
                                Waiting Confirmation
                              </Text>
                            </GridItem>
                            <GridItem w="60px" h="10">
                              <Icon
                                margin={'auto'}
                                w={'47px'}
                                h={'47px'}
                                ml={'11px'}
                              >
                                <FcProcess fontSize={20} />
                              </Icon>
                              <Text
                                mt={'8px'}
                                textAlign={'center'}
                                fontSize={'12px'}
                                fontWeight={400}
                                fontFamily={
                                  'Open Sauce One,Nunito Sans, sans-serif'
                                }
                              >
                                On Process
                              </Text>
                            </GridItem>
                            <GridItem w="60px" h="10">
                              <Icon
                                margin={'auto'}
                                w={'47px'}
                                h={'47px'}
                                ml={'11px'}
                              >
                                <TbTruckDelivery
                                  color="#00B526"
                                  fontSize={20}
                                />
                              </Icon>
                              <Text
                                mt={'8px'}
                                textAlign={'center'}
                                fontSize={'12px'}
                                fontWeight={400}
                                fontFamily={
                                  'Open Sauce One,Nunito Sans, sans-serif'
                                }
                              >
                                Shipping
                              </Text>
                            </GridItem>
                            <GridItem w="60px" h="10">
                              <Icon
                                margin={'auto'}
                                w={'47px'}
                                h={'47px'}
                                ml={'11px'}
                              >
                                <BsBagCheckFill color="#0095DA" fontSize={20} />
                              </Icon>
                              <Text
                                mt={'8px'}
                                textAlign={'center'}
                                fontSize={'12px'}
                                fontWeight={400}
                                fontFamily={
                                  'Open Sauce One,Nunito Sans, sans-serif'
                                }
                              >
                                Delivered
                              </Text>
                            </GridItem>
                          </Grid>
                        </Box>
                        <Box
                          width={'100%'}
                          bgColor={'#e6e6e6'}
                          h={'5px'}
                          mt={'60px'}
                        />
                      </PopoverBody>
                    </PopoverContent>
                  </Popover>
                </Box>
              </Box>
            ) : null}

            {/* Cart */}
            <Box
              display={'flex'}
              gap="4"
              fontSize="14px"
              fontWeight={'semibold'}
            >
              <Link to="/cart">
                <Box
                  display={'flex'}
                  my="auto"
                  gap={2}
                  borderRight="2px solid #e0e0e0"
                  paddingRight={'10px'}
                  color="#6c727c"
                >
                  <Popover trigger="hover">
                    <PopoverTrigger>
                      <Link to="/cart">
                        <Button
                          ml={'10px'}
                          bgColor={'inherit'}
                          fontSize={'2xl'}
                          _hover={{
                            color: '#0095DA',
                          }}
                          mr={'10px'}
                          p={2}
                        >
                          <MdShoppingCart fontSize={'24px'} />
                          {cartSelector.cart.length && authSelector.id ? (
                            <sup>
                              <Box
                                fontSize={'11px'}
                                backgroundColor={'#EF144A'}
                                borderRadius={'50%'}
                                mt={'-2px'}
                                ml={'-8px'}
                                mr={'-8px'}
                                pt={'8px'}
                                pr={'7px'}
                                pb={'9px'}
                                pl={'6px'}
                                color={'white'}
                                fontWeight={700}
                              >
                                {totalCartQuantity}
                              </Box>
                            </sup>
                          ) : null}
                        </Button>
                      </Link>
                    </PopoverTrigger>
                    {cartSelector.cart.length ? (
                      <>
                        <PopoverContent w={'405px'} borderRadius={'12px'}>
                          <PopoverBody>
                            <Box
                              display={'flex'}
                              justifyContent="space-between"
                              mt={'8px'}
                              mb={'12px'}
                              pl={'2px'}
                              pr={'2px'}
                            >
                              <Text
                                // fontFamily={"Open Sauce One,Nunito Sans, sans-serif"}
                                fontSize={'15px'}
                                fontWeight={600}
                              >
                                Total ({totalCartQuantity})
                              </Text>
                              <Link to="/cart">
                                <Text
                                  color="#0095DA"
                                  fontFamily={
                                    'Open Sauce One,Nunito Sans, sans-serif'
                                  }
                                  fontWeight={700}
                                  fontSize={'13px'}
                                  mr={'5px'}
                                >
                                  {' '}
                                  Cart
                                </Text>
                              </Link>
                            </Box>
                            <Box
                              h={'1px'}
                              bgColor={'#0095DA'}
                              mb={'-6px'}
                              pb={'2px'}
                            />
                            <Box
                              h={'1px'}
                              bgColor={'transparent'}
                              pb={'4px'}
                              mt={'2px'}
                            />
                            <Box
                              pt={'2px'}
                              overflow={'auto'}
                              maxH={'335px'}
                              cursor={'pointer'}
                            >
                              {renderCartNavbar()}
                            </Box>
                          </PopoverBody>
                        </PopoverContent>
                      </>
                    ) : (
                      <>
                        <PopoverContent>
                          <PopoverBody>
                            <Box>
                              {/* <Image
                                                            p="10px"
                                                            margin={
                                                                "0 auto"
                                                            }
                                                            width={"200px"}
                                                            src={emptyCart}
                                                        /> */}

                              <Text
                                color={'#393d43'}
                                textAlign="center"
                                fontWeight={'bold'}
                              >
                                Your Shopping cart still empty
                              </Text>
                              <br></br>
                              <Icon
                                margin={'auto'}
                                w={'100px'}
                                h={'100px'}
                                ml={'100px'}
                              >
                                <MdOutlineAddShoppingCart
                                  color={'#0095DA'}
                                  fontSize={20}
                                />
                              </Icon>
                              <Text
                                mt={'5px'}
                                color={'#919396'}
                                textAlign="center"
                                fontSize={'12px'}
                                mb={'5px'}
                              >
                                Let's start shopping now !
                              </Text>
                            </Box>
                          </PopoverBody>
                        </PopoverContent>
                      </>
                    )}
                  </Popover>
                </Box>
              </Link>
              {/* navbar user */}
              {authSelector.username ? (
                <Box
                  display={{ lg: 'flex', base: 'none' }}
                  mr="2"
                  ml="1"
                  cursor={'pointer'}
                >
                  <Popover trigger={'hover'}>
                    <PopoverTrigger>
                      <Box
                        display={'flex'}
                        my="auto"
                        minW={'113px'}
                        maxW="250px"
                        paddingLeft="5px"
                        paddingRight={'5px'}
                        _hover={{
                          color: '#0095DA',
                        }}
                        color={'rgba(0,0,0,.54)'}
                      >
                        <Avatar
                          size="md"
                          name={authSelector.username}
                          mr={2}
                          width={'35px'}
                          height="35px"
                          my="auto"
                          src={`${apiImg}/${authSelector.profile_picture}`}
                        />
                        <Text
                          my="auto"
                          fontSize="16px"
                          //   padding={'8px'}
                          textTransform={'capitalize'}
                        >
                          {authSelector.username.split(' ')[0]}
                        </Text>
                      </Box>
                    </PopoverTrigger>
                    <PopoverContent w={'185px'}>
                      <PopoverBody>
                        <Box>
                          {/* <Box
                            boxShadow={'rgba(0, 0, 0, 0.24) 0px 3px 8px'}
                            display={'flex'}
                            my="auto"
                            padding="6px 12px"
                            borderRadius={'5px'}
                            cursor={'pointer'}
                          >
                            <Avatar
                              name={authSelector.username}
                              mr={2}
                              width={'50px'}
                              height="50px"
                              my="auto"
                              src={`${apiImg}/${authSelector.profile_picture}`}
                            />
                            <Text
                              my="auto"
                              padding={'8px'}
                              fontSize="16px"
                              fontWeight={'bold'}
                              color={'rgba(0,0,0,.54)'}
                              textTransform={'capitalize'}
                            >
                              {authSelector.username}
                            </Text>
                          </Box> */}

                          <Box fontSize={'18px'}>
                            <Link to="/user/profile">
                              <Box
                                // _hover={{
                                //   bgColor: '#A5D8F8',
                                //   borderRadius: '7px',
                                // }}
                                p={'5px 4px'}
                              >
                                <Text>Profile</Text>
                              </Box>
                            </Link>

                            <Link to={'/transaction'}>
                              <Box
                                // _hover={{
                                //   bgColor: '#A5D8F8',
                                //   borderRadius: '7px',
                                // }}
                                p={'5px 4px'}
                              >
                                <Text>Transaction</Text>
                              </Box>
                            </Link>
                            {location.pathname === '/cart' ||
                            location.pathname === '/transaction' ||
                            location.pathname === '/user/profile' ||
                            location.pathname ===
                              '/user/profile/change-password' ||
                            location.pathname === '/user/profile/address' ? (
                              <Link
                                to={'/login'}
                                replace
                                state={{
                                  from: location,
                                }}
                              >
                                <Box
                                  //   display={'flex'}
                                  //   _hover={{
                                  //     bgColor: '#A5D8F8',
                                  //     borderRadius: '7px',
                                  //   }}
                                  p={'5px 4px'}
                                  b="0"
                                  onClick={logoutBtnHandler}
                                >
                                  <Text>Logout</Text>
                                  {/* <Box my="auto" ml="1">
                                    <BiLogOutCircle />
                                  </Box> */}
                                </Box>
                              </Link>
                            ) : (
                              <Box
                                display={'flex'}
                                // _hover={{
                                //   bgColor: '#A5D8F8',
                                //   borderRadius: '7px',
                                // }}
                                p={'5px 4px'}
                                b="0"
                                onClick={logoutBtnHandler}
                              >
                                <Text>Logout</Text>
                                {/* <Box my="auto" ml="1">
                                  <BiLogOutCircle />
                                </Box> */}
                              </Box>
                            )}
                          </Box>
                        </Box>
                      </PopoverBody>
                    </PopoverContent>
                  </Popover>
                </Box>
              ) : (
                // Not login navbar
                <Box
                  gap="2"
                  display={{
                    lg: 'flex',
                    md: 'flex',
                    base: 'none',
                  }}
                  pl={'15px'}
                  mr={'0px'}
                >
                  <Link to={'/login'} replace state={{ from: location }}>
                    <Box width={'85px'}>
                      {/* <Button
                        _hover={'null'}
                        // height="32px"
                        border={'1px solid #0095DA'}
                        bgColor={'white'}
                        color={'#0095DA'}
                        fontSize="12px"
                        fontWeight={'bold'}
                        borderRadius={'15px'}
                      >
                        Login
                      </Button> */}
                      <Button
                        borderColor={'#0095DA'}
                        colorScheme="silver"
                        variant="outline"
                        fontWeight={'bold'}
                        size="md"
                        color={'#0095DA'}
                        borderRadius={'15px'}
                      >
                        Login
                      </Button>
                    </Box>
                  </Link>
                  <Link to="/register">
                    <Box width={'85px'}>
                      {/* <Button
                        _hover={'null'}
                        height="32px"
                        borderRadius={'12px'}
                        bgColor={'#0095DA'}
                        border={'1px solid #0095DA'}
                        color={'#fff'}
                        fontWeight={'bold'}
                        fontSize="12px"
                        textAlign="center"
                        mx={'auto'}
                        w={'65px'}
                      >
                        Register
                      </Button> */}
                     < Button
                        bgColor={'#0095DA'}
                        variant='solid'
                        fontWeight={'bold'}
                        size="md"
                        color={'white'}
                        borderRadius={'15px'}
                        mx={'auto'}
                        w={'75px'}
                      >
                        Register
                      </Button>
                    </Box>
                  </Link>
                </Box>
              )}
            </Box>
          </HStack>
        </Box>
      </Box>
    </>
  );
};

export default Navbar;
