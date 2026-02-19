export function isProd() {
    return !process.env.TESTING_URL && process.env.NODE_ENV === 'production';
}