const apiSuccess = (res, data) => {
    return {
        status: res.status(200),
        data: res.status(200).json(data)
    }
}

const apiFailure = (res, message) => {
    return {
        status: res.status(400),
        message,
    }
}

export { apiSuccess, apiFailure }