const Orders = require('../models/orders.model')
const Vouchers = require('../models/vouchers.model')
const Items = require('../models/items.models')
const getData = require('../utils/formatRes')
const _ = require('lodash');
class OrdersServices {
    
    static addOrder = async ({ deliveryFee, items, customer, voucher, method }) => {
        // method is bank and cast
        try {
            // check exist voucher
            const existVoucher = await Vouchers.findById(voucher)
            
            // check exist list item
            const results = await Promise.all(
                items.map(async (ele) => {
                    const existItem = await Items.findById(ele.item);
                    return !!existItem;
                })
            );
            
            const allExistItem = results.every(exist => exist);
            
            if (!allExistItem) {
                return {
                    success: false,
                    message: "One or more items don't exist",
                };
            }

            const checkPaymentStatus = method === "cast" ? "Chua thanh toan" : "Da thanh toan"

            let firstPrice = items.reduce((total, item) => {
                return total + (item.amount * item.price);
            }, 0);
            
            let totalPrice = 0;
            if (existVoucher){
                totalPrice = (firstPrice*existVoucher.percent)/100; 
            }

            totalPrice = totalPrice + deliveryFee;

            const newOrder = new Orders({
                total: totalPrice,
                intoMoney: firstPrice,
                deliveryStatus: "Dang van chuyen",
                paymentStatus: checkPaymentStatus,
                deliveryFee,
                items: items,
                customer,
                voucher
            })

            const savedOrder = newOrder.save()

            return (await (await savedOrder).populate('voucher')).populate('items.item')
        } catch (error) {
            return {
                success: false,
                message: error.message
            }
        }
    }

    static updateOrder = async ({ id }) => {
        try {
            return await Orders.findByIdAndUpdate({ id }, { total, intoMoney, date, deliveryStatus, paymentStatus })
        } catch (error) {
            return {
                success: false,
                message: error.message
            }
        }
    }

    static deleteOrder = async ({ id }) => {
        try {
            return await Orders.findByIdAndDelete(id)
        } catch (error) {
            return {
                success: false,
                message: error.message
            }
        }
    }

    static getOrder = async () => {
        try {
            const orders = await Orders.find({})
                        .populate("voucher").populate('items.item')
            return orders;
        } catch (error) {
            return {
                success: false,
                message: error.message
            }
        }
    }

    static getOrderID = async ({ id }) => {
        try {
            const existOrder = await Orders.findById(id);
            if (!existOrder){
                return {
                    success: false,
                    message: "Don't exist"
                }
            }
            
            return (await existOrder.populate('voucher')).populate('items.item');
        } catch (error) {
            return {
                success: false,
                message: error.message
            }
        }
    }

    static paymentOrder = async ({amount, orderInfo}) => {
        try {
            // test momo:
            // NGUYEN VAN A
            // 9704 0000 0000 0018
            // 03/07
            // OTP
            // các thông tin đổi để hiện trên Hóa đơn thanh toán: orderInfo, ,amount, orderID,...
            //Đổi redirectURL, ipnURL theo trang web của mình
            var accessKey = 'F8BBA842ECF85';
            var secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';//key để test // không đổi
            var partnerCode = 'MOMO';
            var redirectUrl = 'http://localhost:5173/login'; // Link chuyển hướng tới sau khi thanh toán hóa đơn
            var ipnUrl = 'http://localhost:5173/login';   //trang truy vấn kết quả, để trùng với redirect
            var requestType = "payWithMethod";
            // var amount = '1000'; // Lượng tiền của hóa  <lượng tiền test ko dc cao quá>
            var orderId = partnerCode + new Date().getTime(); // mã Đơn hàng, có thể đổi
            var requestId = orderId;
            var extraData =''; // đây là data thêm của doanh nghiệp (địa chỉ, mã COD,....)
            var paymentCode = 'T8Qii53fAXyUftPV3m9ysyRhEanUs9KlOPfHgpMR0ON50U10Bh+vZdpJU7VY4z+Z2y77fJHkoDc69scwwzLuW5MzeUKTwPo3ZMaB29imm6YulqnWfTkgzqRaion+EuD7FN9wZ4aXE1+mRt0gHsU193y+yxtRgpmY7SDMU9hCKoQtYyHsfFR5FUAOAKMdw2fzQqpToei3rnaYvZuYaxolprm9+/+WIETnPUDlxCYOiw7vPeaaYQQH0BF0TxyU3zu36ODx980rJvPAgtJzH1gUrlxcSS1HQeQ9ZaVM1eOK/jl8KJm6ijOwErHGbgf/hVymUQG65rHU2MWz9U8QUjvDWA==';
            var orderGroupId ='';
            var autoCapture =true;
            var lang = 'vi'; // ngôn ngữ

            // không đụng tới dòng dưới
            var rawSignature = "accessKey=" + accessKey + "&amount=" + amount + "&extraData=" + extraData + "&ipnUrl=" + ipnUrl + "&orderId=" + orderId + "&orderInfo=" + orderInfo + "&partnerCode=" + partnerCode + "&redirectUrl=" + redirectUrl + "&requestId=" + requestId + "&requestType=" + requestType;
            //puts raw signature
            console.log("--------------------RAW SIGNATURE----------------")
            console.log(rawSignature)
            //chữ ký (signature)
            const crypto = require('crypto');
            var signature = crypto.createHmac('sha256', secretKey)
                .update(rawSignature)
                .digest('hex');
            console.log("--------------------SIGNATURE----------------")
            console.log(signature)

            // data gửi đi dưới dạng JSON, gửi tới MoMoEndpoint
            const requestBody = JSON.stringify({
                partnerCode : partnerCode,
                partnerName : "Test",
                storeId : "MomoTestStore",
                requestId : requestId,
                amount : amount,
                orderId : orderId,
                orderInfo : orderInfo,
                redirectUrl : redirectUrl,
                ipnUrl : ipnUrl,
                lang : lang,
                requestType: requestType,
                autoCapture: autoCapture,
                extraData : extraData,
                orderGroupId: orderGroupId,
                signature : signature
            });
            // tạo object https
            const https = require('https');
            const options = {
                hostname: 'test-payment.momo.vn',
                port: 443,
                path: '/v2/gateway/api/create',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(requestBody)
                }
            }
            //gửi yêu cầu tới momo, nhận lại kết quả trả về 
            // Link chuyển hướng tới momo là payUrl, trong phần body của data trả về
            return new Promise((resolve, reject) => {
                const req = https.request(options, res => {
                    console.log(`Status: ${res.statusCode}`);
                    console.log(`Headers: ${JSON.stringify(res.headers)}`);
                    res.setEncoding('utf8');
                    res.on('data', (body) => {
                        console.log('Body: ');
                        console.log(body);
                        resolve(JSON.parse(body));
                        console.log('resultCode: ');
                        console.log(JSON.parse(body).resultCode);
                    });
                    res.on('end', () => {
                        console.log('No more data in response.');
                    });
                })

                req.on('error', (e) => {
                    console.log(`problem with request: ${e.message}`);
                    reject(error)
                });
                // write data to request body
                console.log("Sending....")
                req.write(requestBody);
                req.end();
            })
        // dữ liệu trả về khi thành công: ?partnerCode=MOMO&orderId=MOMO1713984978976&requestId=MOMO1713984978976&amount=1000&orderInfo=30k&orderType=momo_wallet&transId=4029232035&resultCode=0&message=Thành+công.&payType=credit&responseTime=1713985045244&extraData=&signature=0d6f0e650eb5d320c3a65df17a620f01c09d0eae742d3eb7e84177b2ebda6fe0
        } catch (error) {
            return {
                success: false,
                message: error.message,
            }
        }
    }
}

module.exports = OrdersServices