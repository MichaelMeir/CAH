import axios from 'axios'

class AuthService {
  static async isAuthenticated () {
    if (!document.cookie.includes('jwt=')) return false

    try {
      let request = await axios.post(`${location.protocol}//${location.hostname}` + (!process.env.DEV ? '' : (':' + process.env.SERVER_PORT)) + '/api/auth/check', [], {
        withCredentials: true
      })

      if (!request.data.failure && request.status === 200) {
        return true
      }
    } catch (err) {
      return false
    }

    return false
  }

  static async logout () {
    if (!this.isAuthenticated) return

    let request = await axios.post(`${location.protocol}//${location.hostname}` + (!process.env.DEV ? '' : (':' + process.env.SERVER_PORT)) + '/api/auth/logout', [], {
      withCredentials: true
    })

    if (request.status === 200) {
      location.href = location.origin + '/login'
    }
  }

  static async getUser () {
    if (!this.isAuthenticated) return

    let request = await axios.post(`${location.protocol}//${location.hostname}` + (!process.env.DEV ? '' : (':' + process.env.SERVER_PORT)) + '/api/auth/me', [], {
      withCredentials: true
    })

    if (request.status === 200) {
      return request.data
    }
  }

  static async isVerified () {
    if (!this.isAuthenticated) return

    let user = await this.getUser()
    return !user.payload.user.verification
  }
}

export default AuthService
