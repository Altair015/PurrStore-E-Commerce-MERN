import axios from "axios";
import { useEffect, useReducer } from "react";
import { Col, Container, ListGroup, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";
import Loading from "../components/Loading";
import MyCartProduct from "../components/MyCartProduct";
import { orderReducer } from "../reducers/orderReducer";
import { useStateReducer } from "../reducers/reducerFunctions";
import Message from "../components/Message";

function Order() {
    const { userId, orderId } = useParams();

    const [order, orderDispatch] = useReducer(orderReducer, {});

    const [error, errorDispatch] = useReducer(useStateReducer, "")

    const { Item } = ListGroup;

    let address = "";

    let orderDate = ""

    if (order.shippingAddress) {
        const { shippingAddress } = order;
        for (let item of Object.keys(shippingAddress)) {
            console.log(item, shippingAddress[item])
            if (!address) {
                address += shippingAddress[item]
            }
            else if (item === "pincode") {
                address += ` - ${shippingAddress[item]}`
            }
            else {
                address += `, ${shippingAddress[item]}`
            }
        }
        orderDate = new Date(order.createdAt).toDateString()
    }

    async function getOrder() {
        try {
            const orderResponse = await axios.get(
                `/api/getorder/${userId}/${orderId}`
            )
            console.log(51, orderResponse)
            if (orderResponse.status === 201) {
                if (Object.values(orderResponse.data).length) {
                    orderDispatch({ type: "UPDATE_ORDER", payload: orderResponse.data });
                }
                else {
                    errorDispatch("Order not found.")
                }
            }
        }
        catch (error) {
            console.log(error)
            if (Object.values(error.response.data)[0].length) {
                errorDispatch(Object.values(error.response.data)[0])
            }
            else {
                errorDispatch(error.response.statusText)
            }
        }
    }

    useEffect(
        () => {
            getOrder()
        }, []
    )

    return (
        <>
            {
                order.products
                    ?
                    <Container className="p-4">
                        <Row className="gx-5">
                            <Col md={12} lg={8}>
                                <Row className="mb-3">
                                    <Col className="p-4 border rounded-1 lh-md">
                                        <h6 className="d-none d-sm-block p-0 text-truncate fs-sm-4">Order ID : {order.orderId}</h6>
                                        <h6 className="text-truncate d-sm-none" style={{ maxWidth: "250px" }}>Order ID : {order.orderId}</h6>
                                        <h6 className="m-0">Date : {orderDate}</h6>
                                    </Col>
                                </Row>
                                <Row className="mb-3">
                                    <Col className="p-4 border rounded-1 lh-md">
                                        {
                                            order.products.map(
                                                (product, index) => {
                                                    return (
                                                        <MyCartProduct
                                                            key={product.productId}
                                                            {...product}
                                                            displayActions="d-none"
                                                        />
                                                    )
                                                }
                                            )
                                        }
                                    </Col>
                                </Row>
                            </Col>
                            <Col md={12} lg={4} className="px-4 pt-4 pt-lg-0 border-0 rounded-1">
                                <Row className="mb-3">
                                    <Col className="p-4 border rounded-1">
                                        <h4>Order Summary</h4>
                                        <Row className="px-3 py-2 border-bottom">
                                            <Col className="px-0">Items</Col>
                                            <Col className="px-0">₹ {order.amount - 20}.00</Col>
                                        </Row>
                                        <Row className="px-3 py-2 border-bottom">
                                            <Col className="px-0">Shipping</Col>
                                            <Col className="px-0">₹ 0.00</Col>
                                        </Row>
                                        <Row className="px-3 py-2 border-bottom">
                                            <Col className="px-0">Tax</Col>
                                            <Col className="px-0">₹ 20.00</Col>
                                        </Row>
                                        <Row className="px-3 py-2 ">
                                            <Col className="px-0 fw-bold">Order Total</Col>
                                            <Col className="px-0 fw-bold">₹ {order.amount}.00</Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <Row className="mb-3">
                                    <Col className="p-4 border rounded-1 lh-md">
                                        <h4>Payment</h4>
                                        <Item><span className="fw-bold">Method :</span>&nbsp; {order.payment.paymentMethod}</Item>
                                        <Item><span className="fw-bold">Status &nbsp;&nbsp;&nbsp;:</span>&nbsp; {order.payment.paymentStatus}</Item>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col className="p-4 border rounded-1 lh-md">
                                        <h4>Shipping Information</h4>
                                        <Item className="pb-2"><span className="fw-bold">Address : </span>{address}</Item>
                                        <Item><span className="fw-bold">Shipping Status :</span>&nbsp;{order.shippingStatus}</Item>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Container>
                    :
                    error
                        ?
                        // <p className="text-center display-6 fw-medium pt-4">No Records Found.</p>
                        <Message text={error} icon={faCircleExclamation} color="#0dcaf0" size="8x" />
                        :
                        <Loading variant="info" loadingMessage="Loading..." containerClassName="h-100 d-flex align-items-center justify-content-center gap-3" />
            }
        </>
    )
}

export default Order;