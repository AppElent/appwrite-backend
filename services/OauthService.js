import axios from "axios";

class OAuth2Handler {
  constructor(client_id, client_secret, redirect_uri, discoveryUrl) {
    this.client_id = client_id;
    this.client_secret = client_secret;
    this.redirect_uri = redirect_uri;
    this.discoveryUrl = discoveryUrl;
    this.authUrl = null;
    this.tokenUrl = null;
    this.token = null; // Store token details
    this.tokenExpirationTime = null; // Store when the token will expire
  }

  // Discover OAuth settings dynamically using the discovery URL
  async discoverOAuthSettings() {
    try {
      const response = await axios.get(this.discoveryUrl);
      const { authorization_endpoint, token_endpoint } = response.data;

      this.authUrl = authorization_endpoint;
      this.tokenUrl = token_endpoint;

      console.log("Discovered OAuth settings:", {
        authUrl: this.authUrl,
        tokenUrl: this.tokenUrl,
      });
    } catch (error) {
      console.error("Error during OAuth discovery:", error);
      throw error;
    }
  }

  // Generates the Authorization URL for the Authorization Code and Implicit flows
  generateAuthUrl(scope, state, responseType = "code") {
    if (!this.authUrl) {
      throw new Error(
        "Authorization URL not discovered. Call discoverOAuthSettings() first."
      );
    }

    const params = new URLSearchParams({
      client_id: this.client_id,
      redirect_uri: this.redirect_uri,
      response_type: responseType, // 'code' for Auth Code flow, 'token' for Implicit flow
      scope: scope,
      state: state, // Optional but recommended for security
    }).toString();
    return `${this.authUrl}?${params}`;
  }

  // Exchanges an authorization code for an access token
  async exchangeCodeForToken(code) {
    if (!this.tokenUrl) {
      throw new Error(
        "Token URL not discovered. Call discoverOAuthSettings() first."
      );
    }

    const params = {
      client_id: this.client_id,
      client_secret: this.client_secret,
      grant_type: "authorization_code",
      redirect_uri: this.redirect_uri,
      code: code,
    };

    try {
      const response = await axios.post(
        this.tokenUrl,
        new URLSearchParams(params),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      const tokenData = response.data;
      this.storeToken(tokenData);
      return tokenData;
    } catch (error) {
      console.error("Error exchanging code for token:", error);
      throw error;
    }
  }

  // Implicit flow handling (client-side access token retrieval)
  handleImplicitFlow(hashFragment) {
    const params = new URLSearchParams(hashFragment.substring(1));
    const accessToken = params.get("access_token");
    const expiresIn = params.get("expires_in");
    const tokenType = params.get("token_type");

    if (accessToken) {
      const tokenData = {
        access_token: accessToken,
        token_type: tokenType,
        expires_in: expiresIn,
      };
      this.storeToken(tokenData);
      return tokenData;
    } else {
      throw new Error("Access token not found in the URL fragment.");
    }
  }

  // Client credentials flow
  async clientCredentialsFlow(scope) {
    if (!this.tokenUrl) {
      throw new Error(
        "Token URL not discovered. Call discoverOAuthSettings() first."
      );
    }

    const params = {
      client_id: this.client_id,
      client_secret: this.client_secret,
      grant_type: "client_credentials",
      scope: scope,
    };

    try {
      const response = await axios.post(
        this.tokenUrl,
        new URLSearchParams(params),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      const tokenData = response.data;
      this.storeToken(tokenData);
      return tokenData;
    } catch (error) {
      console.error("Error in client credentials flow:", error);
      throw error;
    }
  }

  // Refresh token flow
  async refreshAccessToken(refresh_token) {
    if (!this.tokenUrl) {
      throw new Error(
        "Token URL not discovered. Call discoverOAuthSettings() first."
      );
    }

    const params = {
      client_id: this.client_id,
      client_secret: this.client_secret,
      grant_type: "refresh_token",
      refresh_token: refresh_token,
    };

    try {
      const response = await axios.post(
        this.tokenUrl,
        new URLSearchParams(params),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      const tokenData = response.data;
      this.storeToken(tokenData);
      return tokenData;
    } catch (error) {
      console.error("Error refreshing access token:", error);
      throw error;
    }
  }

  // Store token details and calculate expiration time
  storeToken(tokenData) {
    this.token = tokenData;
    const expiresIn = tokenData.expires_in || 3600; // Default to 1 hour if not provided
    this.tokenExpirationTime = Date.now() + expiresIn * 1000;
  }

  // Check if the token is expired
  isTokenExpired() {
    return !this.tokenExpirationTime || Date.now() >= this.tokenExpirationTime;
  }

  // Generic function to get the token, refresh if necessary
  async getToken(scope, code, flowType = "authorization_code") {
    // If a token exists and is not expired, return it
    if (this.token && !this.isTokenExpired()) {
      return this.token;
    }

    // Otherwise, handle the correct flow to get a new token
    switch (flowType) {
      case "authorization_code":
        if (!code)
          throw new Error(
            "Authorization code is required for authorization_code flow"
          );
        return await this.exchangeCodeForToken(code);
      case "client_credentials":
        return await this.clientCredentialsFlow(scope);
      case "implicit":
        throw new Error(
          "Implicit flow cannot be handled server-side. Use handleImplicitFlow() client-side."
        );
      case "refresh_token":
        if (!this.token || !this.token.refresh_token) {
          throw new Error("Refresh token is not available.");
        }
        return await this.refreshAccessToken(this.token.refresh_token);
      default:
        throw new Error(`Unsupported flow type: ${flowType}`);
    }
  }
}

export default OAuth2Handler;
