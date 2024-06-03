const CustomerModel = require('../models/customer.model')
const ForgetModel = require('../models/forget.model')
const bcrypt = require('bcrypt')
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken')
const getData = require('../utils/formatRes');
const AuthService = require('./auth.service')

const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000);
}

class AccessService {
    // [POST]/v1/api/signup
    static signup = async({email, password, phone}) => {
       try {
            const existUser = await CustomerModel.findOne({ $and: [{email: email}, {phone: phone}] })
            if (existUser) {
                return {
                    statusCode: 201,
                    message: "User already exists"
                }
            }

            const salt = await bcrypt.genSalt()
            const passwordHash = await bcrypt.hash(password, salt)
            
            const newUser = await CustomerModel.create({
                email: (email ? email : null),
                password: passwordHash,
                phone: (phone ? phone : null),
            })
            if (email) {
                var transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: "trannhutphattv@gmail.com",
                        pass: "gltq larm zfkq acgt"
                    }
                })
    
                var mailoptions = {
                    from: "trannhutphattv@gmail.com",
                    to: newUser.email,
                    subject: 'Password Reset Verification Code - Fudee',
                    html: `
                        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
                            <h2 style="color: #4CAF50; text-align: center;">Welcome to Fudee!</h2>
                            <p style="font-size: 18px; color: #333;">Xin chào bạn,</p>
                            <p style="font-size: 16px; color: #333;">
                                Chúng tôi rất vui mừng khi có bạn tham gia. Bạn đã đăng ký tài khoản thành công với Fudee.
                            </p>
                            <div style="text-align: center; margin: 20px 0;">
                                <img src="https://static.vecteezy.com/system/resources/previews/000/417/713/original/text-thank-you-on-green-background-calligraphy-lettering-vector-illustration-eps10.jpg" alt="Thank You" style="max-width: 50%; max-height: 100px; border-radius: 10px;">
                            </div>
                            <p style="font-size: 16px; color: #333;">
                                Hãy khám phá các tính năng của chúng tôi và tận hưởng trải nghiệm mua sắm tốt nhất.
                            </p>
                            <p style="font-size: 16px; color: #333;">
                                Nếu bạn có bất kỳ câu hỏi nào, đừng ngần ngại <a href="mailto:trannhutphattv@gmail.com" style="color: #4CAF50;">liên hệ với chúng tôi</a>.
                            </p>
                            <p style="font-size: 16px; color: #333;">
                                Trân trọng,<br>
                                The Fudee Team
                            </p>
                        </div>
                    `
                }
    
                transporter.sendMail(mailoptions, function(error, info){
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                });
            }
            return {
                success: true,
                user: getData({ fields: ['_id', (email ? 'email' : 'phone')], object: newUser})
            }
       } catch (error) {
            return {
                error: true,
                message: "Internal Server Error"
            }
       }
    }
    // [POST]/v1/api/login
    static login = async({email, password}, res) => {
        try {
            const existUser = await CustomerModel.findOne({email})
            if (!existUser) {
                return {
                    success: false,
                    message: "User not registered"
                }
            }
            const match = await bcrypt.compare(password, existUser.password);
            if (!match) {   
                return {
                    success: false,
                    message: 'Wrong Password'
                }
            }

            const payload = {id: existUser.id, email};

            const accessToken = AuthService.createAccessToken(payload);

            const refreshToken = AuthService.createRefreshToken(payload);

            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: false,
                sameSite: "strict",
                maxAge: 1000 * 60 * 60 * 24 * 14,
                expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14)
            })

            return {
                success: true,
                user: getData({fields: ['_id','email', 'phone', 'address', 'name', 'birthday'], object: existUser}),
                accessToken: accessToken,
            }
        } catch (error) {
            return {
                success: false,
                message: error.message
            }
        }
    }

    static getVerificationCode = async ({email}) => {
        try {
            const existUser = await CustomerModel.findOne({email: email})
            if (!existUser){
                return {
                    success: false,
                    message: "User don't exist"
                }
            }

            if (email) {
                const verificationCode = generateVerificationCode();

                var transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: "trannhutphattv@gmail.com",
                        pass: "gltq larm zfkq acgt"
                    }
                })
    
                var mailoptions = {
                    from: "trannhutphattv@gmail.com",
                    to: existUser.email,
                    subject: 'Verification Code - Fudee',
                    html: `
                        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
                            <h2 style="color: #4CAF50; text-align: center;">Mã xác nhận đặt lại mật khẩu</h2>
                            <p style="font-size: 18px; color: #333;">Xin chào bạn,</p>
                            <p style="font-size: 16px; color: #333;">
                                Chúng tôi đã nhận được yêu cầu đặt lại mật khẩu cho tài khoản Fudee của bạn. Vui lòng sử dụng mã xác nhận dưới đây để đặt lại mật khẩu.
                            </p>
                            <p style="font-size: 16px; color: #333; text-align: center;">
                                Mã xác nhận của bạn là: <strong>${verificationCode}</strong>, mã sẽ có thời hạn trong vòng 24h
                            </p>
                            <p style="font-size: 16px; color: #333;">
                                Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này hoặc liên hệ với bộ phận hỗ trợ của chúng tôi nếu bạn có bất kỳ câu hỏi nào.
                            </p>
                            <p style="font-size: 16px; color: #333;">
                                Trân trọng,<br>
                                The Fudee Team
                            </p>
                        </div>
                    `
                }
    
                transporter.sendMail(mailoptions, function(error, info){
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                }); 

                const currentDate = new Date();
                const expireDate = new Date(currentDate.getTime() + (24 * 60 * 60 * 1000))
                const newForget = new ForgetModel({
                    user: existUser._id,
                    verificationCode: verificationCode,
                    expiredDate: expireDate
                })
                await newForget.save()
            }

            return {
                message: "Send email successfully"
            }
        } catch (error) {
            return {
                success: false,
                message: error.message
            }
        }
    }

    static checkVerification = async ({email, code}) => {
        try {
            const existEmail = await CustomerModel.findOne({email: email})
            if (!existEmail) {
                return {
                    success: false,
                    message: "User don't exist"
                }
            }

            const existForgetPassword = await ForgetModel.find({user: existEmail._id})
            if (!existForgetPassword){
                return {
                    success: false,
                    message: "Verification don't get in email"
                }
            }
            const currentDate = new Date();
            const validObjects = existForgetPassword.filter(ele => 
                new Date(ele.expiredDate) > currentDate && ele.verificationCode === code
            );
            if (validObjects.length === 0){
                return {
                    success: false,
                    message: "Verification code is not valid"
                }
            }
            const lastValidObject = validObjects[validObjects.length - 1];

            return {
                success: true,
                data: lastValidObject
            }
        } catch (error) {
            return {
                success: false,
                message: error.message
            }
        }
    }

    static changePassword = async({email, newPassword}) => {
        try {
            const existEmail = await CustomerModel.findOne({email: email})
            if (!existEmail) {
                return {
                    success: false,
                    message: "User don't exist"
                }
            }

            const salt = await bcrypt.genSalt()
            const newPasswordHash = await bcrypt.hash(newPassword, salt)

            const updateUser = await CustomerModel.findByIdAndUpdate({_id: existEmail._id}, {password: newPasswordHash}, {new: true})
            
            if (updateUser) {
                return {
                    success: true,
                    message: "Password updated successfully",
                    user: updateUser
                };
            } else {
                return {
                    success: false,
                    message: "Failed to update password"
                };
            }
        } catch (error) {
            return {
                success: false,
                message: error.message
            }
        }
    }

    static updateInfo = async ({name, phone, email, birthday}, {userId}) => {
        try {
            const existUser = await CustomerModel.findById(userId)
            if (!existUser) {
                return {
                    success: false,
                    message: "User don't exist"
                }
            }

            return await CustomerModel.findByIdAndUpdate({_id: userId}, {
                name: name, 
                phone: phone, 
                email: email, 
                birthday: birthday
            }, {new: true})
        } catch (error) {
            return {
                success: false,
                message: error.message
            }
        }
    }

    // [POST]v1/api/logout
    static logout = async(req, res) => {
        const ck = req.cookies.refreshToken
        if (!ck) {
            return {
                message: 'You are not logged in'   
            }
        }
        res.clearCookie('refreshToken')
        return {
            message: "Logout successfully"
        }
    }
}

module.exports = AccessService;