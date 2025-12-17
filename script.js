// ========================================
// CloudTest Go - Trial
// ========================================

// Coupon Validation URL
const COUPON_CHECK_URL = 'https://silent-union-abf3.yasir-07a.workers.dev';

// Generate unique session ID for this purchase
const SESSION_ID = generateSessionId();

// Global Variables
let currentStep = 1;
let selectedDeviceTypes = [];
let selectedCountries = [];
let selectedCities = {};
let selectedDevices = {};
let selectedAddons = [];
let activeFilters = [];
let totalAmount = 0;
let couponValidated = false;
let validatedCouponCode = '';

// ========================================
// Session Management
// ========================================

function generateSessionId() {
    // Generate unique session ID using timestamp and random string
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    const sessionId = `session_${timestamp}_${random}`;
    
    // Store in localStorage to track across page refreshes
    localStorage.setItem('cloudtest_session_id', sessionId);
    localStorage.setItem('cloudtest_session_timestamp', timestamp.toString());
    
    console.log('New session created:', sessionId);
    return sessionId;
}

function clearPreviousCart() {
    // Clear any previous cart items by adding empty parameter
    // This tells FoxyCart to clear the cart before adding new items
    let emptyField = document.getElementById('fc-empty-cart');
    
    if (!emptyField) {
        emptyField = document.createElement('input');
        emptyField.type = 'hidden';
        emptyField.name = 'empty';
        emptyField.id = 'fc-empty-cart';
        emptyField.value = 'true';
        document.getElementById('foxycart-hidden-fields').appendChild(emptyField);
    } else {
        emptyField.value = 'true';
    }
    
    console.log('Cart will be cleared before checkout');
}

function addSessionIdToCart() {
    // Add session ID as a custom field
    let sessionField = document.getElementById('fc-session-id');
    
    if (!sessionField) {
        sessionField = document.createElement('input');
        sessionField.type = 'hidden';
        sessionField.name = 'Session_ID';
        sessionField.id = 'fc-session-id';
        document.getElementById('foxycart-hidden-fields').appendChild(sessionField);
    }
    
    sessionField.value = SESSION_ID;
    console.log('Session ID added to cart:', SESSION_ID);
}


// ===== DEVICE DATA =====
const deviceData = [
  { id: 1, name: "Galaxy S9 Plus", country: "Australia", city: "Sydney", type: "android", network: "WiFi", audio: false },
  { id: 2, name: "iPhone 11", country: "Australia", city: "Sydney", type: "ios", network: "WiFi", audio: false },
  { id: 3, name: "Safari", country: "Australia", city: "Sydney", type: "safari", network: "WiFi", audio: false },
  { id: 4, name: "iPhone 13", country: "Australia", city: "Sydney", type: "ios", network: "SIM", audio: false },
  { id: 5, name: "Chrome", country: "Australia", city: "Sydney", type: "chrome", network: "WiFi", audio: false },
  { id: 6, name: "Microsoftedge", country: "Australia", city: "Sydney", type: "microsoftedge", network: "WiFi", audio: false },
  { id: 7, name: "Opera", country: "Australia", city: "Sydney", type: "opera", network: "WiFi", audio: false },
  { id: 8, name: "Galaxy Tab S7", country: "Australia", city: "Sydney", type: "android", network: "WiFi", audio: false },
  { id: 9, name: "Galaxy Tab S8+", country: "Australia", city: "Sydney", type: "android", network: "WiFi", audio: false },
  { id: 10, name: "Firefox", country: "Australia", city: "Sydney", type: "firefox", network: "WiFi", audio: false },
  { id: 11, name: "Chrome", country: "Benin", city: "Cotonou", type: "chrome", network: "WiFi", audio: false },
  { id: 12, name: "Galaxy S21 5G", country: "Brazil", city: "São Paulo", type: "android", network: "WiFi", audio: false },
  { id: 13, name: "iPhone XS", country: "Brazil", city: "São Paulo", type: "ios", network: "WiFi", audio: false },
  { id: 14, name: "Galaxy A12", country: "Brazil", city: "São Paulo", type: "android", network: "WiFi", audio: false },
  { id: 15, name: "Galaxy Tab A10.1", country: "Brazil", city: "São Paulo", type: "android", network: "WiFi", audio: false },
  { id: 16, name: "iPhone 8", country: "Brazil", city: "São Paulo", type: "ios", network: "WiFi", audio: false },
  { id: 17, name: "Galaxy A30s", country: "Brazil", city: "São Paulo", type: "android", network: "WiFi", audio: false },
  { id: 18, name: "Galaxy S20 FE", country: "Brazil", city: "São Paulo", type: "android", network: "WiFi", audio: false },
  { id: 19, name: "Samsung galaxy s10", country: "Brazil", city: "São Paulo", type: "android", network: "WiFi", audio: false },
  { id: 20, name: "moto g8 play", country: "Brazil", city: "São Paulo", type: "android", network: "WiFi", audio: false },
  { id: 21, name: "Firefox", country: "Brazil", city: "São Paulo", type: "firefox", network: "WiFi", audio: false },
  { id: 22, name: "Galaxy S21 5G", country: "Brazil", city: "São Paulo", type: "android", network: "WiFi", audio: false },
  { id: 23, name: "Galaxy A30s", country: "Brazil", city: "São Paulo", type: "android", network: "WiFi", audio: false },
  { id: 24, name: "Galaxy S21 5G", country: "Brazil", city: "São Paulo", type: "android", network: "WiFi", audio: false },
  { id: 25, name: "Galaxy Tab S5e", country: "Brazil", city: "São Paulo", type: "android", network: "WiFi", audio: false },
  { id: 26, name: "Galaxy A11", country: "Brazil", city: "São Paulo", type: "android", network: "WiFi", audio: false },
  { id: 27, name: "Galaxy A50", country: "Brazil", city: "São Paulo", type: "android", network: "WiFi", audio: false },
  { id: 28, name: "Samsung galaxy s10", country: "Brazil", city: "São Paulo", type: "android", network: "WiFi", audio: false },
  { id: 29, name: "iPhone XR", country: "Brazil", city: "São Paulo", type: "ios", network: "WiFi", audio: false },
  { id: 30, name: "iPad Air (3rd Gen)", country: "Brazil", city: "São Paulo", type: "ios", network: "WiFi", audio: true },
  { id: 31, name: "Galaxy S21 5G", country: "Canada", city: "Toronto", type: "android", network: "SIM", audio: false },
  { id: 32, name: "Galaxy S21 5G", country: "Canada", city: "Toronto", type: "android", network: "WiFi", audio: false },
  { id: 33, name: "Safari", country: "Canada", city: "Toronto", type: "safari", network: "WiFi", audio: false },
  { id: 34, name: "Galaxy A8", country: "Canada", city: "Toronto", type: "android", network: "WiFi", audio: false },
  { id: 35, name: "Moto G7", country: "Canada", city: "Toronto", type: "android", network: "WiFi", audio: false },
  { id: 36, name: "Galaxy S20 FE 5G", country: "Canada", city: "Toronto", type: "android", network: "WiFi", audio: false },
  { id: 37, name: "Galaxy S21 5G", country: "Canada", city: "Toronto", type: "android", network: "WiFi", audio: false },
  { id: 38, name: "OnePlus 6T", country: "Canada", city: "Toronto", type: "android", network: "WiFi", audio: false },
  { id: 39, name: "Pixel 3", country: "Canada", city: "Toronto", type: "android", network: "WiFi", audio: false },
  { id: 40, name: "Galaxy S20 5G", country: "Canada", city: "Toronto", type: "android", network: "WiFi", audio: false },
  { id: 41, name: "iPhone 12", country: "Canada", city: "Toronto", type: "ios", network: "WiFi", audio: false },
  { id: 42, name: "iPhone 11", country: "Canada", city: "Toronto", type: "ios", network: "WiFi", audio: true },
  { id: 43, name: "Safari", country: "Czech Republic", city: "Prague", type: "safari", network: "WiFi", audio: false },
  { id: 44, name: "Safari", country: "Czech Republic", city: "Prague", type: "safari", network: "WiFi", audio: false },
  { id: 45, name: "iPhone 11", country: "France", city: "Paris", type: "ios", network: "WiFi", audio: true },
  { id: 46, name: "Galaxy A54", country: "France", city: "Paris", type: "android", network: "WiFi", audio: true },
  { id: 47, name: "Pixel 4", country: "Germany", city: "Leverkusen", type: "android", network: "WiFi", audio: false },
  { id: 48, name: "Galaxy A12", country: "Germany", city: "Leverkusen", type: "android", network: "WiFi", audio: false },
  { id: 49, name: "Samsung J5 (2016)", country: "Germany", city: "Leverkusen", type: "android", network: "WiFi", audio: false },
  { id: 50, name: "Chrome", country: "Germany", city: "Leverkusen", type: "chrome", network: "WiFi", audio: false },
  { id: 51, name: "iPhone XS Max", country: "Germany", city: "Leverkusen", type: "ios", network: "SIM", audio: false },
  { id: 52, name: "Safari", country: "Germany", city: "Leverkusen", type: "safari", network: "WiFi", audio: false },
  { id: 53, name: "Microsoftedge", country: "Germany", city: "Leverkusen", type: "microsoftedge", network: "WiFi", audio: false },
  { id: 54, name: "iPhone 12", country: "Great Britain", city: "London", type: "ios", network: "WiFi", audio: false },
  { id: 55, name: "Galaxy S20 FE", country: "Great Britain", city: "London", type: "android", network: "SIM", audio: false },
  { id: 56, name: "Galaxy S20 FE", country: "Great Britain", city: "London", type: "android", network: "SIM", audio: false },
  { id: 57, name: "iPhone 12", country: "Great Britain", city: "London", type: "ios", network: "SIM", audio: false },
  { id: 58, name: "Pixel 6", country: "Great Britain", city: "London", type: "android", network: "SIM", audio: false },
  { id: 59, name: "OnePlus 9 Pro", country: "Great Britain", city: "London", type: "android", network: "WiFi", audio: false },
  { id: 60, name: "iPhone SE 2", country: "Great Britain", city: "London", type: "ios", network: "WiFi", audio: false },
  { id: 61, name: "Galaxy J5", country: "Great Britain", city: "London", type: "android", network: "WiFi", audio: false },
  { id: 62, name: "Galaxy S9 Plus", country: "Great Britain", city: "London", type: "android", network: "WiFi", audio: false },
  { id: 63, name: "iPhone 8 Plus", country: "Great Britain", city: "London", type: "ios", network: "WiFi", audio: false },
  { id: 64, name: "Chrome", country: "Great Britain", city: "London", type: "chrome", network: "WiFi", audio: false },
  { id: 65, name: "iPad Pro (10.5-inch)", country: "Great Britain", city: "London", type: "ios", network: "WiFi", audio: false },
  { id: 66, name: "iPad (9th Gen)", country: "Great Britain", city: "London", type: "ios", network: "WiFi", audio: false },
  { id: 67, name: "iPhone XS", country: "Great Britain", city: "London", type: "ios", network: "WiFi", audio: false },
  { id: 68, name: "Chrome", country: "Hong Kong", city: "Hong Kong", type: "chrome", network: "WiFi", audio: false },
  { id: 69, name: "Galaxy A50", country: "Hong Kong", city: "Hong Kong", type: "android", network: "WiFi", audio: false },
  { id: 70, name: "iPhone 11", country: "Hong Kong", city: "Hong Kong", type: "ios", network: "WiFi", audio: false },
  { id: 71, name: "Galaxy A35", country: "Hong Kong", city: "Hong Kong", type: "android", network: "WiFi", audio: false },
  { id: 72, name: "Pixel 4a", country: "India", city: "Bangalore", type: "android", network: "WiFi", audio: false },
  { id: 73, name: "Galaxy A32", country: "India", city: "Bangalore", type: "android", network: "WiFi", audio: false },
  { id: 74, name: "Galaxy S21 FE 5G", country: "India", city: "Bangalore", type: "android", network: "WiFi", audio: false },
  { id: 75, name: "Galaxy A13", country: "India", city: "Bangalore", type: "android", network: "WiFi", audio: false },
  { id: 76, name: "Galaxy M31s", country: "India", city: "Bangalore", type: "android", network: "WiFi", audio: false },
  { id: 77, name: "Galaxy M52 5G", country: "India", city: "Bangalore", type: "android", network: "WiFi", audio: false },
  { id: 78, name: "Samsung J6 Plus", country: "India", city: "Bangalore", type: "android", network: "WiFi", audio: false },
  { id: 79, name: "Chrome", country: "India", city: "Bangalore", type: "chrome", network: "WiFi", audio: false },
  { id: 80, name: "iPhone 7 Plus", country: "India", city: "Bangalore", type: "ios", network: "WiFi", audio: false },
  { id: 81, name: "vivo Y21", country: "India", city: "Bangalore", type: "android", network: "WiFi", audio: false },
  { id: 82, name: "Vivo Y55s", country: "India", city: "Bangalore", type: "android", network: "WiFi", audio: false },
  { id: 83, name: "Galaxy A33 5G", country: "India", city: "Bangalore", type: "android", network: "WiFi", audio: false },
  { id: 84, name: "Galaxy S22", country: "India", city: "Bangalore", type: "android", network: "WiFi", audio: false },
  { id: 85, name: "iPhone 12", country: "India", city: "Bangalore", type: "ios", network: "WiFi", audio: false },
  { id: 86, name: "V11 Pro", country: "India", city: "Bangalore", type: "android", network: "WiFi", audio: false },
  { id: 87, name: "Samsung M51", country: "India", city: "Bangalore", type: "android", network: "WiFi", audio: false },
  { id: 88, name: "Galaxy S22", country: "India", city: "Bangalore", type: "android", network: "WiFi", audio: false },
  { id: 89, name: "Mi A1", country: "India", city: "Bangalore", type: "android", network: "WiFi", audio: false },
  { id: 90, name: "Galaxy A33 5G", country: "India", city: "Bangalore", type: "android", network: "WiFi", audio: false },
  { id: 91, name: "Y15s", country: "India", city: "Bangalore", type: "android", network: "WiFi", audio: false },
  { id: 92, name: "Firefox", country: "India", city: "Bangalore", type: "firefox", network: "WiFi", audio: false },
  { id: 93, name: "Galaxy A53 5G", country: "India", city: "Bangalore", type: "android", network: "WiFi", audio: false },
  { id: 94, name: "iPhone 12 Pro", country: "India", city: "Bangalore", type: "ios", network: "WiFi", audio: false },
  { id: 95, name: "Moto G22", country: "India", city: "Bangalore", type: "android", network: "WiFi", audio: false },
  { id: 96, name: "Firefox", country: "India", city: "Bangalore", type: "firefox", network: "WiFi", audio: false },
  { id: 97, name: "Redmi Note 5 Pro", country: "India", city: "Bangalore", type: "android", network: "WiFi", audio: false },
  { id: 98, name: "Redmi Note 11 Pro", country: "India", city: "Bangalore", type: "android", network: "WiFi", audio: false },
  { id: 99, name: "Galaxy J7 Nxt", country: "India", city: "Bangalore", type: "android", network: "WiFi", audio: false },
  { id: 100, name: "Redmi Note 5 Pro", country: "India", city: "Bangalore", type: "android", network: "WiFi", audio: false },
  { id: 101, name: "Galaxy A13", country: "India", city: "Bangalore", type: "android", network: "WiFi", audio: false },
  { id: 102, name: "iPhone 6", country: "Indonesia", city: "Jakarta", type: "ios", network: "WiFi", audio: false },
  { id: 103, name: "Safari", country: "Indonesia", city: "Jakarta", type: "safari", network: "WiFi", audio: false },
  { id: 104, name: "iPhone 11", country: "Indonesia", city: "Jakarta", type: "ios", network: "WiFi", audio: false },
  { id: 105, name: "Redmi 6A", country: "Indonesia", city: "Jakarta", type: "android", network: "WiFi", audio: false },
  { id: 106, name: "Galaxy A23", country: "Indonesia", city: "Jakarta", type: "android", network: "WiFi", audio: false },
  { id: 107, name: "iPhone 6", country: "Indonesia", city: "Jakarta", type: "ios", network: "WiFi", audio: false },
  { id: 108, name: "Galaxy A33 5G", country: "Indonesia", city: "Jakarta", type: "android", network: "WiFi", audio: false },
  { id: 109, name: "Microsoftedge", country: "Indonesia", city: "Jakarta", type: "microsoftedge", network: "WiFi", audio: false },
  { id: 110, name: "iPhone 11", country: "Indonesia", city: "Jakarta", type: "ios", network: "WiFi", audio: false },
  { id: 111, name: "Realme C15", country: "Indonesia", city: "Jakarta", type: "android", network: "WiFi", audio: false },
  { id: 112, name: "Galaxy S22", country: "Indonesia", city: "Jakarta", type: "android", network: "WiFi", audio: false },
  { id: 113, name: "Y30", country: "Indonesia", city: "Jakarta", type: "android", network: "WiFi", audio: false },
  { id: 114, name: "Opera", country: "Indonesia", city: "Jakarta", type: "opera", network: "WiFi", audio: false },
  { id: 115, name: "Galaxy A23", country: "Indonesia", city: "Jakarta", type: "android", network: "WiFi", audio: false },
  { id: 116, name: "Galaxy A23", country: "Indonesia", city: "Jakarta", type: "android", network: "WiFi", audio: false },
  { id: 117, name: "Galaxy S20 FE 5G", country: "Ireland", city: "Dublin", type: "android", network: "WiFi", audio: false },
  { id: 118, name: "Galaxy A54", country: "Ireland", city: "Dublin", type: "android", network: "WiFi", audio: false },
  { id: 119, name: "Chrome", country: "Japan", city: "Tokyo", type: "chrome", network: "WiFi", audio: false },
  { id: 120, name: "ipad (6th Gen)", country: "Japan", city: "Tokyo", type: "ios", network: "WiFi", audio: true },
  { id: 121, name: "Sharp Aquos Sense", country: "Japan", city: "Tokyo", type: "android", network: "WiFi", audio: false },
  { id: 122, name: "Sharp Aquos Sense", country: "Japan", city: "Tokyo", type: "android", network: "WiFi", audio: true },
  { id: 123, name: "Aquos Sense 3", country: "Japan", city: "Tokyo", type: "android", network: "WiFi", audio: false },
  { id: 124, name: "Aquos Sense 3", country: "Japan", city: "Tokyo", type: "android", network: "WiFi", audio: false },
  { id: 125, name: "Pixel 3a", country: "Japan", city: "Tokyo", type: "android", network: "WiFi", audio: true },
  { id: 126, name: "Asus Zenfone Max Pro (M2)", country: "Japan", city: "Tokyo", type: "android", network: "WiFi", audio: false },
  { id: 127, name: "Xperia Ace", country: "Japan", city: "Tokyo", type: "android", network: "WiFi", audio: true },
  { id: 128, name: "Sony Xperia XZ1", country: "Japan", city: "Tokyo", type: "android", network: "WiFi", audio: false },
  { id: 129, name: "Galaxy S21 Ultra 5G", country: "Japan", city: "Tokyo", type: "android", network: "WiFi", audio: false },
  { id: 130, name: "Galaxy A51", country: "Japan", city: "Tokyo", type: "android", network: "WiFi", audio: true },
  { id: 131, name: "iPhone XR", country: "Japan", city: "Tokyo", type: "ios", network: "WiFi", audio: true },
  { id: 132, name: "Galaxy S10 5G", country: "Japan", city: "Tokyo", type: "android", network: "WiFi", audio: true },
  { id: 133, name: "Galaxy A25 5G", country: "Malaysia", city: "Kuala Lumpur", type: "android", network: "WiFi", audio: false },
  { id: 134, name: "Galaxy A16 5G", country: "Malaysia", city: "Kuala Lumpur", type: "android", network: "WiFi", audio: false },
  { id: 135, name: "Galaxy A23", country: "Malaysia", city: "Kuala Lumpur", type: "android", network: "WiFi", audio: false },
  { id: 136, name: "Galaxy A23", country: "Malaysia", city: "Kuala Lumpur", type: "android", network: "WiFi", audio: false },
  { id: 137, name: "Firefox", country: "Netherlands", city: "The Hague", type: "firefox", network: "WiFi", audio: false },
  { id: 138, name: "Galaxy Note 3", country: "Nigeria", city: "Lagos", type: "android", network: "WiFi", audio: false },
  { id: 139, name: "Pixel 2", country: "Philippines", city: "Manila", type: "android", network: "WiFi", audio: false },
  { id: 140, name: "Galaxy S10+", country: "Philippines", city: "Manila", type: "android", network: "WiFi", audio: false },
  { id: 141, name: "Galaxy A73 5G", country: "Philippines", city: "Manila", type: "android", network: "WiFi", audio: false },
  { id: 142, name: "Galaxy A72", country: "Philippines", city: "Manila", type: "android", network: "WiFi", audio: false },
  { id: 143, name: "iPhone XR", country: "Singapore", city: "Singapore", type: "ios", network: "WiFi", audio: false },
  { id: 144, name: "iPhone 12", country: "South Africa", city: "Johannesburg", type: "ios", network: "WiFi", audio: false },
  { id: 145, name: "iPhone XS", country: "South Africa", city: "Johannesburg", type: "ios", network: "WiFi", audio: false },
  { id: 146, name: "Galaxy S21 5G", country: "South Korea", city: "Seoul", type: "android", network: "WiFi", audio: false },
  { id: 147, name: "Galaxy S8", country: "South Korea", city: "Seoul", type: "android", network: "WiFi", audio: false },
  { id: 148, name: "Galaxy S22", country: "South Korea", city: "Seoul", type: "android", network: "WiFi", audio: false },
  { id: 149, name: "Galaxy S21 5G", country: "South Korea", city: "Seoul", type: "android", network: "WiFi", audio: false },
  { id: 150, name: "Galaxy S22 Ultra 5G", country: "South Korea", city: "Seoul", type: "android", network: "WiFi", audio: false },
  { id: 151, name: "Galaxy S21 5G", country: "South Korea", city: "Seoul", type: "android", network: "WiFi", audio: false },
  { id: 152, name: "Galaxy S22", country: "South Korea", city: "Seoul", type: "android", network: "WiFi", audio: false },
  { id: 153, name: "Galaxy S20 5G", country: "South Korea", city: "Seoul", type: "android", network: "WiFi", audio: false },
  { id: 154, name: "Galaxy Note10 Plus 5G", country: "South Korea", city: "Seoul", type: "android", network: "WiFi", audio: false },
  { id: 155, name: "Chrome", country: "South Korea", city: "Seoul", type: "chrome", network: "WiFi", audio: false },
  { id: 156, name: "iPhone 11 Pro", country: "South Korea", city: "Seoul", type: "ios", network: "WiFi", audio: false },
  { id: 157, name: "Galaxy A50", country: "South Korea", city: "Seoul", type: "android", network: "WiFi", audio: false },
  { id: 158, name: "iPhone 11", country: "South Korea", city: "Seoul", type: "ios", network: "WiFi", audio: false },
  { id: 159, name: "Samsung galaxy s10", country: "South Korea", city: "Seoul", type: "android", network: "WiFi", audio: false },
  { id: 160, name: "Reno2 Z", country: "Taiwan", city: "Taipei", type: "android", network: "WiFi", audio: false },
  { id: 161, name: "Galaxy A23", country: "Thailand", city: "Bangkok", type: "android", network: "WiFi", audio: false },
  { id: 162, name: "iPhone XS", country: "Thailand", city: "Bangkok", type: "ios", network: "WiFi", audio: false },
  { id: 163, name: "Pixel 4 XL", country: "Thailand", city: "Bangkok", type: "android", network: "WiFi", audio: false },
  { id: 164, name: "Galaxy J6 Plus", country: "Thailand", city: "Bangkok", type: "android", network: "WiFi", audio: false },
  { id: 165, name: "Galaxy A23", country: "Thailand", city: "Bangkok", type: "android", network: "WiFi", audio: false },
  { id: 166, name: "Vivo Y93", country: "Thailand", city: "Bangkok", type: "android", network: "WiFi", audio: false },
  { id: 167, name: "iPhone 11", country: "Turkey", city: "Istanbul", type: "ios", network: "WiFi", audio: false },
  { id: 168, name: "Chrome", country: "United Arab Emirates", city: "Dubai", type: "chrome", network: "WiFi", audio: false },
  { id: 169, name: "Galaxy S9", country: "United Arab Emirates", city: "Dubai", type: "android", network: "WiFi", audio: false },
  { id: 170, name: "Chrome", country: "United Arab Emirates", city: "Dubai", type: "chrome", network: "WiFi", audio: false },
  { id: 171, name: "Pixel 5", country: "US", city: "Chicago", type: "android", network: "WiFi", audio: false },
  { id: 172, name: "Google Pixel 3a XL", country: "US", city: "Riverside", type: "android", network: "SIM", audio: false },
  { id: 173, name: "Pixel 4a", country: "US", city: "Riverside", type: "android", network: "WiFi", audio: false },
  { id: 174, name: "iPad", country: "US", city: "Riverside", type: "ios", network: "WiFi", audio: false },
  { id: 175, name: "Pixel 8", country: "US", city: "Riverside", type: "android", network: "WiFi", audio: false },
  { id: 176, name: "Galaxy Z Fold 5", country: "US", city: "Riverside", type: "android", network: "WiFi", audio: false },
  { id: 177, name: "Galaxy S10 5G", country: "US", city: "Riverside", type: "android", network: "WiFi", audio: false },
  { id: 178, name: "Galaxy S20 5G", country: "US", city: "Riverside", type: "android", network: "WiFi", audio: false },
  { id: 179, name: "Firefox", country: "US", city: "Sunnyvale", type: "firefox", network: "WiFi", audio: false },
  { id: 180, name: "Chrome", country: "US", city: "Riverside", type: "chrome", network: "WiFi", audio: false },
  { id: 181, name: "Fire TV Stick 4K", country: "US", city: "Sunnyvale", type: "android", network: "WiFi", audio: false },
  { id: 182, name: "Galaxy S21 5G", country: "US", city: "Riverside", type: "android", network: "WiFi", audio: false },
  { id: 183, name: "Pixel 7a", country: "US", city: "Riverside", type: "android", network: "WiFi", audio: false },
  { id: 184, name: "Google Pixel 3a XL", country: "US", city: "Riverside", type: "android", network: "WiFi", audio: false },
  { id: 185, name: "iPhone 12", country: "US", city: "Riverside", type: "ios", network: "WiFi", audio: false },
  { id: 186, name: "Galaxy S22 5G", country: "US", city: "Riverside", type: "android", network: "WiFi", audio: false },
  { id: 187, name: "Pixel 4", country: "US", city: "Sunnyvale", type: "android", network: "WiFi", audio: false },
  { id: 188, name: "Pixel 4 XL", country: "US", city: "Riverside", type: "android", network: "WiFi", audio: false },
  { id: 189, name: "iPhone XS Max", country: "US", city: "Riverside", type: "ios", network: "SIM", audio: false },
  { id: 190, name: "Safari", country: "US", city: "Sunnyvale", type: "safari", network: "WiFi", audio: false },
  { id: 191, name: "iPhone XR", country: "US", city: "Riverside", type: "ios", network: "WiFi", audio: false },
  { id: 192, name: "Galaxy S22 5G", country: "US", city: "Riverside", type: "android", network: "WiFi", audio: false },
  { id: 193, name: "iPad Pro 11in (3rd Gen)", country: "US", city: "Riverside", type: "ios", network: "WiFi", audio: false },
  { id: 194, name: "Galaxy S21 5G", country: "US", city: "Riverside", type: "android", network: "SIM", audio: false },
  { id: 195, name: "iPhone SE 2", country: "US", city: "Riverside", type: "ios", network: "WiFi", audio: false },
  { id: 196, name: "Chrome", country: "US", city: "Sunnyvale", type: "chrome", network: "WiFi", audio: false },
  { id: 197, name: "Galaxy S24", country: "US", city: "Riverside", type: "android", network: "WiFi", audio: true },
  { id: 198, name: "iPhone 11 Pro Max", country: "US", city: "Chicago", type: "ios", network: "SIM", audio: false },
  { id: 199, name: "Pixel 4", country: "US", city: "Riverside", type: "android", network: "WiFi", audio: false },
  { id: 200, name: "iPhone SE 2", country: "US", city: "Riverside", type: "ios", network: "WiFi", audio: false },
  { id: 201, name: "iPhone 8", country: "US", city: "Newark", type: "ios", network: "WiFi", audio: false },
  { id: 202, name: "iPhone 12", country: "US", city: "Riverside", type: "ios", network: "WiFi", audio: false },
  { id: 203, name: "Tab A 10.1", country: "US", city: "Riverside", type: "android", network: "WiFi", audio: false },
  { id: 204, name: "Opera", country: "US", city: "Chicago", type: "opera", network: "WiFi", audio: false },
  { id: 205, name: "iPhone13 ProMax", country: "US", city: "Riverside", type: "ios", network: "SIM", audio: false },
  { id: 206, name: "Firefox", country: "US", city: "Sunnyvale", type: "firefox", network: "WiFi", audio: false },
  { id: 207, name: "Fire TV Stick 4K", country: "US", city: "Riverside", type: "android", network: "WiFi", audio: false },
  { id: 208, name: "Fire TV Stick 4K", country: "US", city: "Sunnyvale", type: "android", network: "WiFi", audio: false },
  { id: 209, name: "Pixel 3", country: "US", city: "Riverside", type: "android", network: "WiFi", audio: false },
  { id: 210, name: "Fire TV Stick 4K", country: "US", city: "Sunnyvale", type: "android", network: "WiFi", audio: false },
  { id: 211, name: "Galaxy Note10 Plus 5G", country: "US", city: "Riverside", type: "android", network: "WiFi", audio: false },
  { id: 212, name: "Galaxy S7", country: "US", city: "Riverside", type: "android", network: "WiFi", audio: false },
  { id: 213, name: "iPhone 12", country: "US", city: "Riverside", type: "ios", network: "WiFi", audio: false },
  { id: 214, name: "Galaxy S20 FE 5G", country: "US", city: "Riverside", type: "android", network: "WiFi", audio: false },
  { id: 215, name: "Pixel 5", country: "US", city: "Riverside", type: "android", network: "WiFi", audio: false },
  { id: 216, name: "Opera", country: "US", city: "Riverside", type: "opera", network: "WiFi", audio: false },
  { id: 217, name: "Galaxy S23 Ultra", country: "US", city: "Riverside", type: "android", network: "WiFi", audio: false },
  { id: 218, name: "Safari", country: "US", city: "Riverside", type: "safari", network: "WiFi", audio: false },
  { id: 219, name: "iPhone XR", country: "US", city: "Riverside", type: "ios", network: "WiFi", audio: false },
  { id: 220, name: "iPhone 11 Pro", country: "US", city: "Riverside", type: "ios", network: "WiFi", audio: false },
  { id: 221, name: "iPhone 11 Pro", country: "US", city: "Riverside", type: "ios", network: "SIM", audio: false },
  { id: 222, name: "iPad Pro 11in (3rd Gen)", country: "US", city: "Riverside", type: "ios", network: "WiFi", audio: false },
  { id: 223, name: "Pixel 4", country: "US", city: "Riverside", type: "android", network: "WiFi", audio: false },
  { id: 224, name: "Galaxy A52", country: "US", city: "Riverside", type: "android", network: "WiFi", audio: false },
  { id: 225, name: "Galaxy S9", country: "US", city: "Riverside", type: "android", network: "WiFi", audio: false },
  { id: 226, name: "Galaxy S20 5G", country: "US", city: "Riverside", type: "android", network: "WiFi", audio: false },
  { id: 227, name: "iPhone 12", country: "US", city: "Riverside", type: "ios", network: "WiFi", audio: false },
  { id: 228, name: "e5 cruise", country: "US", city: "Riverside", type: "android", network: "WiFi", audio: false },
  { id: 229, name: "Firefox", country: "US", city: "Palo Alto", type: "firefox", network: "WiFi", audio: false },
  { id: 230, name: "Pixel 4", country: "US", city: "Riverside", type: "android", network: "SIM", audio: false },
  { id: 231, name: "iPhone 14", country: "US", city: "Riverside", type: "ios", network: "SIM", audio: false },
  { id: 232, name: "Galaxy A40", country: "US", city: "Riverside", type: "android", network: "WiFi", audio: false },
  { id: 233, name: "iPhone SE 2", country: "US", city: "Riverside", type: "ios", network: "WiFi", audio: false },
  { id: 234, name: "Tab A 10.1", country: "US", city: "Riverside", type: "android", network: "WiFi", audio: false },
  { id: 235, name: "LG V30", country: "US", city: "Riverside", type: "android", network: "WiFi", audio: false },
  { id: 236, name: "iPhone 14", country: "US", city: "Riverside", type: "ios", network: "WiFi", audio: false },
  { id: 237, name: "Galaxy S20 FE", country: "US", city: "Riverside", type: "android", network: "WiFi", audio: false },
  { id: 238, name: "Google Pixel 3a XL", country: "US", city: "Riverside", type: "android", network: "WiFi", audio: false },
  { id: 239, name: "iPhone SE 2", country: "US", city: "Riverside", type: "ios", network: "WiFi", audio: false },
  { id: 240, name: "Pixel 2", country: "US", city: "Riverside", type: "android", network: "WiFi", audio: false },
  { id: 241, name: "Galaxy S23 Ultra", country: "US", city: "Riverside", type: "android", network: "WiFi", audio: false },
  { id: 242, name: "iPhone XS Max", country: "US", city: "Riverside", type: "ios", network: "SIM", audio: false },
  { id: 243, name: "Galaxy S9", country: "US", city: "Riverside", type: "android", network: "SIM", audio: false },
  { id: 244, name: "Galaxy A20", country: "US", city: "Riverside", type: "android", network: "WiFi", audio: false },
  { id: 245, name: "iPad Pro(12.9in 6th Gen)", country: "US", city: "Riverside", type: "ios", network: "SIM", audio: false },
  { id: 246, name: "Firefox", country: "US", city: "Sunnyvale", type: "firefox", network: "WiFi", audio: false },
  { id: 247, name: "PH-1", country: "US", city: "Riverside", type: "android", network: "WiFi", audio: false },
  { id: 248, name: "Pixel 4", country: "US", city: "Riverside", type: "android", network: "WiFi", audio: false },
  { id: 249, name: "Safari", country: "US", city: "Riverside", type: "safari", network: "WiFi", audio: false },
  { id: 250, name: "iPhone 8 Plus", country: "US", city: "Riverside", type: "ios", network: "SIM", audio: false },
  { id: 251, name: "Safari", country: "US", city: "Riverside", type: "safari", network: "WiFi", audio: false },
  { id: 252, name: "iPhone 13", country: "US", city: "Riverside", type: "ios", network: "SIM", audio: false },
  { id: 253, name: "Pixel 4 XL", country: "US", city: "Riverside", type: "android", network: "WiFi", audio: false },
  { id: 254, name: "Chrome", country: "US", city: "Sunnyvale", type: "chrome", network: "WiFi", audio: false },
  { id: 255, name: "Galaxy S20+ 5G", country: "US", city: "Riverside", type: "android", network: "WiFi", audio: false },
  { id: 256, name: "Galaxy S10", country: "US", city: "Riverside", type: "android", network: "WiFi", audio: false },
  { id: 257, name: "iPhone13 ProMax", country: "US", city: "Riverside", type: "ios", network: "WiFi", audio: false },
  { id: 258, name: "Firefox", country: "US", city: "Palo Alto", type: "firefox", network: "WiFi", audio: false },
  { id: 259, name: "Safari", country: "US", city: "Newark", type: "safari", network: "WiFi", audio: false },
  { id: 260, name: "Firefox", country: "US", city: "Chicago", type: "firefox", network: "WiFi", audio: false },
  { id: 261, name: "iPhone 11 Pro Max", country: "US", city: "Riverside", type: "ios", network: "WiFi", audio: false },
  { id: 262, name: "Galaxy S24 Ultra", country: "US", city: "Riverside", type: "android", network: "WiFi", audio: false },
  { id: 263, name: "iPhone 14 Pro", country: "US", city: "Riverside", type: "ios", network: "WiFi", audio: false },
  { id: 264, name: "Pixel 2", country: "US", city: "Riverside", type: "android", network: "WiFi", audio: false },
  { id: 265, name: "iPhone 11 Pro", country: "US", city: "Riverside", type: "ios", network: "SIM", audio: false },
  { id: 266, name: "Safari", country: "US", city: "Riverside", type: "safari", network: "WiFi", audio: false },
  { id: 267, name: "iPhone 12", country: "US", city: "Riverside", type: "ios", network: "WiFi", audio: false },
  { id: 268, name: "Galaxy A53 5G", country: "US", city: "Riverside", type: "android", network: "WiFi", audio: false },
  { id: 269, name: "Galaxy S7 Edge", country: "US", city: "Riverside", type: "android", network: "WiFi", audio: false },
  { id: 270, name: "iPhone X", country: "US", city: "Riverside", type: "ios", network: "WiFi", audio: false },
  { id: 271, name: "Chrome", country: "US", city: "Chicago", type: "chrome", network: "WiFi", audio: false },
  { id: 272, name: "iPhone 6S", country: "US", city: "Riverside", type: "ios", network: "WiFi", audio: false },
  { id: 273, name: "Galaxy S20+ 5G", country: "US", city: "Riverside", type: "android", network: "SIM", audio: false },
  { id: 274, name: "Galaxy S23", country: "US", city: "Riverside", type: "android", network: "WiFi", audio: false },
  { id: 275, name: "iPhone XR", country: "US", city: "Riverside", type: "ios", network: "WiFi", audio: false },
  { id: 276, name: "Galaxy S10", country: "US", city: "Riverside", type: "android", network: "SIM", audio: false },
  { id: 277, name: "LG K51", country: "US", city: "Riverside", type: "android", network: "WiFi", audio: false },
  { id: 278, name: "Firefox", country: "US", city: "Newark", type: "firefox", network: "WiFi", audio: false },
  { id: 279, name: "Galaxy Note 3", country: "US", city: "Riverside", type: "android", network: "WiFi", audio: false },
  { id: 280, name: "iPhone 11 Pro Max", country: "US", city: "Riverside", type: "ios", network: "WiFi", audio: false },
  { id: 281, name: "Galaxy S20+ 5G", country: "US", city: "Riverside", type: "android", network: "WiFi", audio: false },
  { id: 282, name: "Microsoftedge", country: "US", city: "Riverside", type: "microsoftedge", network: "WiFi", audio: false },
  { id: 283, name: "Galaxy A10e", country: "US", city: "Riverside", type: "android", network: "WiFi", audio: false },
  { id: 284, name: "Galaxy S9", country: "US", city: "Riverside", type: "android", network: "WiFi", audio: false },
  { id: 285, name: "Google Pixel 3a XL", country: "US", city: "Sunnyvale", type: "android", network: "WiFi", audio: true },
  { id: 286, name: "Galaxy S10", country: "US", city: "Sunnyvale", type: "android", network: "WiFi", audio: true },
  { id: 287, name: "Microsoftedge", country: "US", city: "Palo Alto", type: "microsoftedge", network: "WiFi", audio: false },
  { id: 288, name: "Fire TV Stick (Gen 3)", country: "US", city: "Riverside", type: "android", network: "WiFi", audio: false },
  { id: 289, name: "moto g pure", country: "US", city: "Riverside", type: "android", network: "WiFi", audio: false },
  { id: 290, name: "Galaxy A20", country: "US", city: "Riverside", type: "android", network: "WiFi", audio: false },
  { id: 291, name: "iPhone 8 Plus", country: "US", city: "Riverside", type: "ios", network: "WiFi", audio: false },
  { id: 292, name: "Safari", country: "US", city: "Sunnyvale", type: "safari", network: "WiFi", audio: false },
  { id: 293, name: "Galaxy S23", country: "US", city: "Riverside", type: "android", network: "WiFi", audio: false },
  { id: 294, name: "Apple TV 4K (2nd gen)", country: "US", city: "Riverside", type: "ios", network: "WiFi", audio: false },
  { id: 295, name: "Apple TV 4K (2nd gen)", country: "US", city: "Riverside", type: "ios", network: "WiFi", audio: false },
  { id: 296, name: "Galaxy S21 5G", country: "US", city: "Riverside", type: "android", network: "WiFi", audio: false },
  { id: 297, name: "Microsoftedge", country: "US", city: "Chicago", type: "microsoftedge", network: "WiFi", audio: false },
  { id: 298, name: "Apple TV 4K (2nd gen)", country: "US", city: "Riverside", type: "ios", network: "WiFi", audio: false },
  { id: 299, name: "Microsoftedge", country: "US", city: "Riverside", type: "microsoftedge", network: "WiFi", audio: false },
  { id: 300, name: "iPhone 6 Plus", country: "US", city: "Riverside", type: "ios", network: "WiFi", audio: false },
  { id: 301, name: "Galaxy S10", country: "US", city: "Riverside", type: "android", network: "WiFi", audio: false },
  { id: 302, name: "iPhone 12 Mini", country: "US", city: "Chicago", type: "ios", network: "SIM", audio: true },
  { id: 303, name: "Tab A 8.0", country: "US", city: "Riverside", type: "android", network: "WiFi", audio: false },
  { id: 304, name: "Pixel 4", country: "US", city: "Riverside", type: "android", network: "WiFi", audio: false },
  { id: 305, name: "Safari", country: "US", city: "Sunnyvale", type: "safari", network: "WiFi", audio: false },
  { id: 306, name: "iPhone XS", country: "US", city: "Riverside", type: "ios", network: "WiFi", audio: false },
  { id: 307, name: "iPhone 12", country: "US", city: "Riverside", type: "ios", network: "WiFi", audio: false },
  { id: 308, name: "Galaxy S23+", country: "US", city: "Riverside", type: "android", network: "WiFi", audio: false },
  { id: 309, name: "Samsung Galaxy S10+", country: "US", city: "Riverside", type: "android", network: "WiFi", audio: false },
  { id: 310, name: "iPhone 13", country: "US", city: "Riverside", type: "ios", network: "WiFi", audio: false },
  { id: 311, name: "Opera", country: "US", city: "Riverside", type: "opera", network: "WiFi", audio: false },
  { id: 312, name: "Fire 8 HD", country: "US", city: "Riverside", type: "android", network: "WiFi", audio: false },
  { id: 313, name: "Galaxy S8", country: "US", city: "Riverside", type: "android", network: "WiFi", audio: false },
  { id: 314, name: "Galaxy S10e", country: "US", city: "Riverside", type: "android", network: "WiFi", audio: false },
  { id: 315, name: "iPhone 11", country: "US", city: "Riverside", type: "ios", network: "WiFi", audio: false },
  { id: 316, name: "Pixel 5", country: "US", city: "Riverside", type: "android", network: "WiFi", audio: false },
  { id: 317, name: "Chrome", country: "US", city: "Riverside", type: "chrome", network: "WiFi", audio: false },
  { id: 318, name: "Fire HD Tab", country: "US", city: "Riverside", type: "android", network: "WiFi", audio: false },
  { id: 319, name: "Microsoftedge", country: "US", city: "Sunnyvale", type: "microsoftedge", network: "WiFi", audio: false },
  { id: 320, name: "iPhone 8", country: "US", city: "Riverside", type: "ios", network: "WiFi", audio: false },
  { id: 321, name: "Stylo 6", country: "US", city: "Riverside", type: "android", network: "SIM", audio: false },
  { id: 322, name: "iPhone XR", country: "US", city: "Riverside", type: "ios", network: "WiFi", audio: false },
  { id: 323, name: "Chrome", country: "US", city: "Riverside", type: "chrome", network: "WiFi", audio: false },
  { id: 324, name: "Microsoftedge", country: "US", city: "Palo Alto", type: "microsoftedge", network: "WiFi", audio: false },
  { id: 325, name: "iPhone 15", country: "US", city: "Riverside", type: "ios", network: "WiFi", audio: false },
  { id: 326, name: "iPhone 11", country: "US", city: "Riverside", type: "ios", network: "SIM", audio: false },
  { id: 327, name: "Microsoftedge", country: "US", city: "Sunnyvale", type: "microsoftedge", network: "WiFi", audio: false },
  { id: 328, name: "iPhone 8 Plus", country: "US", city: "Riverside", type: "ios", network: "WiFi", audio: false },
  { id: 329, name: "iPhone XR", country: "US", city: "Riverside", type: "ios", network: "WiFi", audio: false },
  { id: 330, name: "Chrome", country: "US", city: "Riverside", type: "chrome", network: "WiFi", audio: false },
  { id: 331, name: "iPhone XR", country: "US", city: "Riverside", type: "ios", network: "WiFi", audio: false },
  { id: 332, name: "Galaxy A52", country: "US", city: "Riverside", type: "android", network: "WiFi", audio: false },
  { id: 333, name: "Pixel 5", country: "US", city: "Sunnyvale", type: "android", network: "WiFi", audio: true },
  { id: 334, name: "iPhone SE 2", country: "US", city: "Riverside", type: "ios", network: "WiFi", audio: false },
  { id: 335, name: "Galaxy S10", country: "US", city: "Riverside", type: "android", network: "SIM", audio: false },
  { id: 336, name: "Galaxy S10", country: "US", city: "Riverside", type: "android", network: "WiFi", audio: false },
  { id: 337, name: "iPhone X", country: "US", city: "Riverside", type: "ios", network: "WiFi", audio: false },
  { id: 338, name: "iPhone SE 2", country: "US", city: "Riverside", type: "ios", network: "WiFi", audio: false },
  { id: 339, name: "Samsung Galaxy S10+", country: "US", city: "Riverside", type: "android", network: "WiFi", audio: false },
  { id: 340, name: "Galaxy A53 5G", country: "US", city: "Riverside", type: "android", network: "WiFi", audio: false },
  { id: 341, name: "Galaxy S23", country: "US", city: "Riverside", type: "android", network: "WiFi", audio: false },
  { id: 342, name: "iPhone SE 2", country: "US", city: "Riverside", type: "ios", network: "WiFi", audio: false },
  { id: 343, name: "Samsung Galaxy S10+", country: "US", city: "Riverside", type: "android", network: "WiFi", audio: false },
  { id: 344, name: "iPad Mini 4", country: "US", city: "Riverside", type: "ios", network: "WiFi", audio: false },
  { id: 345, name: "Google Pixel 3a XL", country: "US", city: "Riverside", type: "android", network: "WiFi", audio: false }
];

// ========================================
// Utility Functions
// ========================================

function showLoading() {
    document.getElementById('loadingOverlay').classList.add('show');
}

function hideLoading() {
    document.getElementById('loadingOverlay').classList.remove('show');
}

function showModal() {
    document.getElementById('successModal').classList.add('show');
}

function closeModal() {
    document.getElementById('successModal').classList.remove('show');
}

function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
}

function hideError(elementId) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.classList.remove('show');
    }
}

// ========================================
// Navigation Functions
// ========================================

function updateProgressBar() {
    const progressFill = document.getElementById('progressFill');
    const steps = document.querySelectorAll('.step');
    const percentage = (currentStep / 7) * 100;
    
    progressFill.style.width = percentage + '%';
    
    steps.forEach((step, index) => {
        const stepNum = index + 1;
        if (stepNum < currentStep) {
            step.classList.add('completed');
            step.classList.remove('active');
        } else if (stepNum === currentStep) {
            step.classList.add('active');
            step.classList.remove('completed');
        } else {
            step.classList.remove('active', 'completed');
        }
    });
}

function nextStep(step) {
    if (validateCurrentStep()) {
        currentStep = step;
        updateStepVisibility();
        updateProgressBar();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function prevStep(step) {
    currentStep = step;
    updateStepVisibility();
    updateProgressBar();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateStepVisibility() {
    document.querySelectorAll('.form-section').forEach((section, index) => {
        if (index + 1 === currentStep) {
            section.classList.add('active');
        } else {
            section.classList.remove('active');
        }
    });
    
    // Update UI based on step
    if (currentStep === 3) {
        populateCountries();
    } else if (currentStep === 4) {
        populateCities();
    } else if (currentStep === 5) {
        populateDevices();
    } else if (currentStep === 6) {
        updatePricingSummary();
    } else if (currentStep === 7) {
        loadFinalSummary();
        populateFoxyCartFields();
    }
}

function validateCurrentStep() {
    hideError('deviceType-error');
    hideError('country-error');
    hideError('city-error');
    hideError('device-error');
    
    switch(currentStep) {
        case 1:
            return validateContactInfo();
        case 2:
            if (selectedDeviceTypes.length === 0) {
                showError('deviceType-error', 'Please select at least one device type');
                return false;
            }
            return true;
        case 3:
            if (selectedCountries.length === 0) {
                showError('country-error', 'Please select at least one country');
                return false;
            }
            return true;
        case 4:
            const hasSelectedCity = Object.values(selectedCities).some(cities => cities.length > 0);
            if (!hasSelectedCity) {
                showError('city-error', 'Please select at least one city');
                return false;
            }
            return true;
        case 5:
            if (Object.keys(selectedDevices).length === 0) {
                showError('device-error', 'Please select at least one device');
                return false;
            }
            return true;
        case 6:
            return true;
        default:
            return true;
    }
}

function validateContactInfo() {
    let isValid = true;
    
    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('businessEmail').value.trim();
    const phone = document.getElementById('phoneNumber').value.trim();
    const org = document.getElementById('organizationName').value.trim();
    
    hideError('fullName-error');
    hideError('businessEmail-error');
    hideError('phoneNumber-error');
    hideError('organizationName-error');
    
    if (!fullName) {
        showError('fullName-error', 'Full name is required');
        isValid = false;
    }
    
    if (!email || !isValidEmail(email)) {
        showError('businessEmail-error', 'Please enter a valid business email');
        isValid = false;
    }
    
    if (!phone) {
        showError('phoneNumber-error', 'Phone number is required');
        isValid = false;
    }
    
    if (!org) {
        showError('organizationName-error', 'Organization name is required');
        isValid = false;
    }
    
    return isValid;
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// ========================================
// Step 2: Device Type Selection
// ========================================

function setupDeviceTypeSelection() {
    document.querySelectorAll('.selection-card[data-type]').forEach(card => {
        card.addEventListener('click', function() {
            const type = this.dataset.type;
            const checkbox = this.querySelector('input[type="checkbox"]');
            
            if (selectedDeviceTypes.includes(type)) {
                selectedDeviceTypes = selectedDeviceTypes.filter(t => t !== type);
                this.classList.remove('selected');
                checkbox.checked = false;
            } else {
                selectedDeviceTypes.push(type);
                this.classList.add('selected');
                checkbox.checked = true;
            }
            
            updateDeviceTypeButton();
        });
    });
}

function updateDeviceTypeButton() {
    const nextButton = document.getElementById('deviceTypeNext');
    nextButton.disabled = selectedDeviceTypes.length === 0;
}

// ========================================
// Step 3: Country Selection
// ========================================

function populateCountries() {
    const countryGrid = document.getElementById('countryGrid');
    const availableCountries = getAvailableCountries();
    
    countryGrid.innerHTML = '';
    
    availableCountries.forEach(country => {
        const card = createCountryCard(country);
        countryGrid.appendChild(card);
    });
    
    updateCountryButton();
}

function getAvailableCountries() {
    const countries = new Set();
    deviceData.forEach(device => {
        if (selectedDeviceTypes.includes(device.type)) {
            countries.add(device.country);
        }
    });
    return Array.from(countries).sort();
}

function createCountryCard(country) {
    const card = document.createElement('div');
    card.className = 'selection-card';
    card.dataset.country = country;
    
    if (selectedCountries.includes(country)) {
        card.classList.add('selected');
    }
    
    card.innerHTML = `
        <div class="card-icon">
            <i class="fas fa-globe"></i>
        </div>
        <div class="card-content">
            <h3>${country}</h3>
            <span class="device-count">${getDeviceCountForCountry(country)} devices</span>
        </div>
        <div class="card-checkbox">
            <input type="checkbox" ${selectedCountries.includes(country) ? 'checked' : ''}>
        </div>
    `;
    
    card.addEventListener('click', function() {
        toggleCountrySelection(country, card);
    });
    
    return card;
}

function getDeviceCountForCountry(country) {
    return deviceData.filter(device => 
        selectedDeviceTypes.includes(device.type) && device.country === country
    ).length;
}

function toggleCountrySelection(country, card) {
    const checkbox = card.querySelector('input[type="checkbox"]');
    
    if (selectedCountries.includes(country)) {
        selectedCountries = selectedCountries.filter(c => c !== country);
        card.classList.remove('selected');
        checkbox.checked = false;
        delete selectedCities[country];
    } else {
        selectedCountries.push(country);
        card.classList.add('selected');
        checkbox.checked = true;
    }
    
    updateCountryButton();
}

function updateCountryButton() {
    const nextButton = document.getElementById('countryNext');
    nextButton.disabled = selectedCountries.length === 0;
}

// Search functionality for countries
document.getElementById('countrySearch')?.addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase();
    document.querySelectorAll('#countryGrid .selection-card').forEach(card => {
        const countryName = card.dataset.country.toLowerCase();
        if (countryName.includes(searchTerm)) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
});

// Select all countries functionality
document.getElementById('selectAllCountries')?.addEventListener('change', function(e) {
    const availableCountries = getAvailableCountries();
    const cards = document.querySelectorAll('#countryGrid .selection-card');
    
    if (e.target.checked) {
        selectedCountries = [...availableCountries];
        cards.forEach(card => {
            card.classList.add('selected');
            card.querySelector('input[type="checkbox"]').checked = true;
        });
    } else {
        selectedCountries = [];
        cards.forEach(card => {
            card.classList.remove('selected');
            card.querySelector('input[type="checkbox"]').checked = false;
        });
    }
    
    updateCountryButton();
});

// ========================================
// Step 4: City Selection
// ========================================

function populateCities() {
    const cityContainer = document.getElementById('citySelections');
    cityContainer.innerHTML = '';
    
    selectedCountries.forEach(country => {
        const citySection = createCitySection(country);
        cityContainer.appendChild(citySection);
    });
    
    updateCityButton();
}

function createCitySection(country) {
    const section = document.createElement('div');
    section.className = 'country-city-section';
    section.style.marginBottom = '2rem';
    
    const cities = getAvailableCities(country);
    
    const html = `
        <h3 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 1rem; color: var(--text-primary); display: flex; align-items: center; gap: 0.5rem;">
            <i class="fas fa-map-marker-alt" style="color: var(--primary-color);"></i>
            ${country}
        </h3>
        <div class="selection-grid" data-country="${country}">
            ${cities.map(city => createCityCardHTML(country, city)).join('')}
        </div>
    `;
    
    section.innerHTML = html;
    
    // Add event listeners
    section.querySelectorAll('.selection-card').forEach(card => {
        card.addEventListener('click', function() {
            const city = this.dataset.city;
            const country = this.closest('[data-country]').dataset.country;
            toggleCitySelection(country, city, card);
        });
    });
    
    return section;
}

function getAvailableCities(country) {
    const cities = new Set();
    deviceData.forEach(device => {
        if (selectedDeviceTypes.includes(device.type) && device.country === country) {
            cities.add(device.city);
        }
    });
    return Array.from(cities).sort();
}

function createCityCardHTML(country, city) {
    const isSelected = selectedCities[country]?.includes(city);
    return `
        <div class="selection-card ${isSelected ? 'selected' : ''}" data-city="${city}">
            <div class="card-icon">
                <i class="fas fa-city"></i>
            </div>
            <div class="card-content">
                <h3>${city}</h3>
                <span class="device-count">${getDeviceCountForCity(country, city)} devices</span>
            </div>
            <div class="card-checkbox">
                <input type="checkbox" ${isSelected ? 'checked' : ''}>
            </div>
        </div>
    `;
}

function getDeviceCountForCity(country, city) {
    return deviceData.filter(device => 
        selectedDeviceTypes.includes(device.type) && 
        device.country === country && 
        device.city === city
    ).length;
}

function toggleCitySelection(country, city, card) {
    if (!selectedCities[country]) {
        selectedCities[country] = [];
    }
    
    const checkbox = card.querySelector('input[type="checkbox"]');
    
    if (selectedCities[country].includes(city)) {
        selectedCities[country] = selectedCities[country].filter(c => c !== city);
        card.classList.remove('selected');
        checkbox.checked = false;
    } else {
        selectedCities[country].push(city);
        card.classList.add('selected');
        checkbox.checked = true;
    }
    
    updateCityButton();
}

function updateCityButton() {
    const nextButton = document.getElementById('cityNext');
    const hasSelectedCity = Object.values(selectedCities).some(cities => cities.length > 0);
    nextButton.disabled = !hasSelectedCity;
}
// ========================================
// Step 5: Device Selection with Filters
// ========================================

function populateDevices() {
    const deviceList = document.getElementById('deviceList');
    const filteredDevices = getFilteredDevices();
    
    deviceList.innerHTML = '';
    
    if (filteredDevices.length === 0) {
        deviceList.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 2rem;">No devices match your criteria.</p>';
        return;
    }
    
    filteredDevices.forEach(device => {
        const card = createDeviceCard(device);
        deviceList.appendChild(card);
    });
    
    updateDeviceButton();
}

function getFilteredDevices() {
    let devices = deviceData.filter(device => {
        // Check device type
        if (!selectedDeviceTypes.includes(device.type)) return false;
        
        // Check country and city
        const countryMatch = selectedCountries.includes(device.country);
        const cityMatch = selectedCities[device.country]?.includes(device.city);
        
        if (!countryMatch || !cityMatch) return false;
        
        // Check filters
        if (activeFilters.includes('wifi') && !device.wifi) return false;
        if (activeFilters.includes('sim') && !device.sim) return false;
        if (activeFilters.includes('audio') && !device.audio) return false;
        
        return true;
    });
    
    return devices;
}

function createDeviceCard(device) {
    const card = document.createElement('div');
    card.className = 'device-card';
    card.dataset.deviceId = device.id;
    
    if (selectedDevices[device.id]) {
        card.classList.add('selected');
    }
    
    card.innerHTML = `
        <div class="device-header">
            <div class="device-info">
                <h4>${device.name}</h4>
                <span class="device-type-badge">${device.type.toUpperCase()}</span>
            </div>
            <div class="device-checkbox">
                <input type="checkbox" ${selectedDevices[device.id] ? 'checked' : ''}>
            </div>
        </div>
        <div class="device-details">
            <div class="detail-item">
                <i class="fas fa-globe"></i>
                <span>${device.country}, ${device.city}</span>
            </div>
        </div>
        <div class="device-capabilities">
            <span class="capability-badge ${device.wifi ? 'enabled' : ''}">
                <i class="fas fa-wifi"></i> WiFi ${device.wifi ? 'Enabled' : 'Disabled'}
            </span>
            <span class="capability-badge ${device.sim ? 'enabled' : ''}">
                <i class="fas fa-sim-card"></i> SIM ${device.sim ? 'Enabled' : 'Disabled'}
            </span>
            <span class="capability-badge ${device.audio ? 'enabled' : ''}">
                <i class="fas fa-volume-up"></i> Audio ${device.audio ? 'Enabled' : 'Disabled'}
            </span>
        </div>
    `;
    
    card.addEventListener('click', function(e) {
        if (!e.target.closest('.device-checkbox')) {
            toggleDeviceSelection(device.id, card);
        }
    });
    
    const checkbox = card.querySelector('input[type="checkbox"]');
    checkbox.addEventListener('change', function(e) {
        e.stopPropagation();
        toggleDeviceSelection(device.id, card);
    });
    
    return card;
}

function toggleDeviceSelection(deviceId, card) {
    const checkbox = card.querySelector('input[type="checkbox"]');
    const device = deviceData.find(d => d.id === deviceId);
    
    if (selectedDevices[deviceId]) {
        delete selectedDevices[deviceId];
        card.classList.remove('selected');
        checkbox.checked = false;
    } else {
        selectedDevices[deviceId] = device;
        card.classList.add('selected');
        checkbox.checked = true;
    }
    
    updateDeviceButton();
}

function updateDeviceButton() {
    const nextButton = document.getElementById('deviceNext');
    nextButton.disabled = Object.keys(selectedDevices).length === 0;
}

function setupDeviceFilters() {
    document.querySelectorAll('.filter-item[data-filter]').forEach(item => {
        const checkbox = item.querySelector('input[type="checkbox"]');
        const filter = item.dataset.filter;
        
        checkbox?.addEventListener('change', function() {
            if (filter === 'select-all') {
                handleSelectAllFilters(this.checked);
            } else {
                handleIndividualFilter(filter, this.checked, item);
            }
        });
    });
}

function handleSelectAllFilters(checked) {
    const filterItems = document.querySelectorAll('.filter-item:not([data-filter="select-all"])');
    
    if (checked) {
        activeFilters = ['wifi', 'sim', 'audio'];
        filterItems.forEach(item => {
            item.classList.add('active');
            item.querySelector('input[type="checkbox"]').checked = true;
        });
    } else {
        activeFilters = [];
        filterItems.forEach(item => {
            item.classList.remove('active');
            item.querySelector('input[type="checkbox"]').checked = false;
        });
    }
    
    if (currentStep === 5) {
        populateDevices();
    }
}

function handleIndividualFilter(filter, checked, item) {
    if (checked) {
        if (!activeFilters.includes(filter)) {
            activeFilters.push(filter);
        }
        item.classList.add('active');
    } else {
        activeFilters = activeFilters.filter(f => f !== filter);
        item.classList.remove('active');
        
        // Uncheck select all
        const selectAllCheckbox = document.querySelector('.filter-item[data-filter="select-all"] input[type="checkbox"]');
        if (selectAllCheckbox) {
            selectAllCheckbox.checked = false;
        }
    }
    
    if (currentStep === 5) {
        populateDevices();
    }
}

// ========================================
// Step 6: Pricing and Add-ons
// ========================================

function setupAddonSelection() {
    document.querySelectorAll('.addon-card[data-addon]').forEach(card => {
        card.addEventListener('click', function() {
            const addon = this.dataset.addon;
            const checkbox = this.querySelector('input[type="checkbox"]');
            
            if (selectedAddons.includes(addon)) {
                selectedAddons = selectedAddons.filter(a => a !== addon);
                this.classList.remove('selected');
                checkbox.checked = false;
            } else {
                selectedAddons.push(addon);
                this.classList.add('selected');
                checkbox.checked = true;
            }
            
            updatePricingSummary();
        });
    });
}

function calculateAddonTotal(deviceCount) {
    if (selectedAddons.length === 0) return 0;
    
    let addonPricePerDevice = 0;
    if (selectedAddons.length === 1) {
        addonPricePerDevice = 100;
    } else if (selectedAddons.length === 2) {
        addonPricePerDevice = 150;
    } else if (selectedAddons.length === 3) {
        addonPricePerDevice = 250;
    }
    
    return deviceCount * addonPricePerDevice;
}

function updatePricingSummary() {
    const deviceCount = Object.keys(selectedDevices).length;
    const devicePrice = 300;
    
    let deviceTotal = deviceCount * devicePrice;
    let addonTotal = calculateAddonTotal(deviceCount);
    
    totalAmount = deviceTotal + addonTotal;
    
    // Get device types and countries
    const selectedDeviceIds = Object.keys(selectedDevices);
    const actualDeviceTypes = [...new Set(
        selectedDeviceIds.map(deviceId => {
            const device = deviceData.find(d => d.id == deviceId);
            return device ? device.type : null;
        }).filter(type => type !== null)
    )];
    
    const actualCountries = [...new Set(
        selectedDeviceIds.map(deviceId => {
            const device = deviceData.find(d => d.id == deviceId);
            return device ? device.country : null;
        }).filter(country => country !== null)
    )];
    
    // Create addon description
    let addonDescription = '';
    if (selectedAddons.length > 0) {
        const addonNames = {
            'automation': 'Automation+',
            'experience': 'Experience+', 
            'performance': 'Performance+'
        };
        const selectedAddonNames = selectedAddons.map(addon => addonNames[addon]);
        
        let discountNote = '';
        if (selectedAddons.length === 2) {
            discountNote = ' (25% discount applied)';
        } else if (selectedAddons.length === 3) {
            discountNote = ' (special bundle pricing)';
        }
        
        addonDescription = `<p><strong>${selectedAddonNames.join(', ')}</strong> add-ons × <strong>${deviceCount}</strong> devices = <strong>$ ${addonTotal.toLocaleString()}</strong>${discountNote}</p>`;
    }
    
    const orderDetails = document.getElementById('orderDetails');
    if (orderDetails) {
        orderDetails.innerHTML = `
            <p><strong>Cloud<i>Test</i> Go - 1 Month Trial</strong> - <strong>${deviceCount}</strong> devices × <strong>$${devicePrice}</strong> = <strong>$ ${deviceTotal.toLocaleString()}</strong></p>
            ${addonDescription}
        `;
    }
    
    const totalAmountElement = document.getElementById('totalAmount');
    if (totalAmountElement) {
        totalAmountElement.textContent = `${totalAmount.toLocaleString()}`;
    }
}

// ========================================
// Coupon Validation Functions
// ========================================

function setupCouponValidation() {
    const applyCouponBtn = document.getElementById('applyCouponBtn');
    const couponInput = document.getElementById('couponCode');
    
    if (applyCouponBtn) {
        applyCouponBtn.addEventListener('click', validateCoupon);
    }
    
    if (couponInput) {
        couponInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                validateCoupon();
            }
        });
        
        couponInput.addEventListener('input', function() {
            if (couponValidated) {
                couponValidated = false;
                validatedCouponCode = '';
                hideCouponMessage();
                couponInput.classList.remove('valid', 'invalid');
            }
        });
    }
}


// final coupon field change

function setupReceiptCouponValidation() {
    const applyBtn = document.getElementById('receiptApplyCouponBtn');
    const couponInput = document.getElementById('receiptCouponCode');

    if (!applyBtn || !couponInput) return;

    applyBtn.addEventListener('click', validateReceiptCoupon);

    couponInput.addEventListener('keypress', e => {
        if (e.key === 'Enter') {
            e.preventDefault();
            validateReceiptCoupon();
        }
    });
}

async function validateReceiptCoupon() {

    const couponInput = document.getElementById('receiptCouponCode');
    const messageBox = document.getElementById('receiptCouponMessage');
    const badge = document.getElementById('couponAppliedBadge');

    const email = document.getElementById('businessEmail').value.trim();
    const couponCode = couponInput.value.trim().toUpperCase();

    if (!email || !email.includes("@")) {
        messageBox.innerHTML = "Please enter your email first.";
        messageBox.className = "coupon-message error show";
        return;
    }

    if (!couponCode) {
        messageBox.innerHTML = "Please enter a coupon.";
        messageBox.className = "coupon-message error show";
        return;
    }

    const emailDomain = email.split("@")[1].toLowerCase();

    messageBox.innerHTML = "Validating coupon…";
    messageBox.className = "coupon-message show";

    try {
        const res = await fetch(COUPON_CHECK_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ emailDomain, couponCode })
        });

        const result = await res.json();

        if (result.allowed) {
            messageBox.className = "coupon-message success show";
            messageBox.innerHTML = result.message;

            badge.style.display = "inline-block";

            // Save coupon to FoxyCart hidden field
            populateFoxyCartCouponField(couponCode);

        } else {
            messageBox.className = "coupon-message error show";
            messageBox.innerHTML = result.message;

            badge.style.display = "none";
        }

    } catch (err) {
        messageBox.className = "coupon-message error show";
        messageBox.innerHTML = "Error validating coupon.";
        badge.style.display = "none";
    }
}
// 

// ===============================
// Coupon Validation Functions
// ===============================

function setupCouponValidation() {
    const applyCouponBtn = document.getElementById('applyCouponBtn');
    const couponInput = document.getElementById('couponCode');

    if (applyCouponBtn) {
        applyCouponBtn.addEventListener('click', validateCoupon);
    }

    if (couponInput) {
        couponInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                validateCoupon();
            }
        });

        couponInput.addEventListener('input', function () {
            couponValidated = false;
            validatedCouponCode = '';
            couponInput.classList.remove('valid', 'invalid');
            hideCouponMessage();
        });
    }
}

async function validateCoupon() {
    const couponInput = document.getElementById('couponCode');
    const couponCode = couponInput.value.trim().toUpperCase();

    const email = document.getElementById('businessEmail').value.trim();
    const couponLoading = document.getElementById('couponLoading');
    const applyCouponBtn = document.getElementById('applyCouponBtn');

    if (!couponCode) {
        showCouponMessage("Please enter a coupon code", "error");
        return;
    }

    if (!email || !email.includes("@")) {
        showCouponMessage("Please enter your email first", "error");
        return;
    }

    const emailDomain = email.split("@")[1].toLowerCase().trim();

    hideCouponMessage();
    couponLoading.classList.add("show");
    applyCouponBtn.disabled = true;
    couponInput.disabled = true;

    try {
        const response = await fetch(COUPON_CHECK_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                emailDomain: emailDomain,
                couponCode: couponCode
            })
        });

        const result = await response.json();

        couponLoading.classList.remove("show");
        applyCouponBtn.disabled = false;
        couponInput.disabled = false;

        if (result.allowed) {
            couponValidated = true;
            validatedCouponCode = couponCode;
            couponInput.classList.remove("invalid");
            couponInput.classList.add("valid");
            showCouponMessage(result.message, "success");

            populateFoxyCartCouponField(couponCode);
        } else {
            couponValidated = false;
            validatedCouponCode = "";
            couponInput.classList.remove("valid");
            couponInput.classList.add("invalid");
            showCouponMessage(result.message, "error");
        }

    } catch (err) {
        console.error("COUPON ERROR:", err);
        couponLoading.classList.remove("show");
        applyCouponBtn.disabled = false;
        couponInput.disabled = false;

        showCouponMessage("Error validating coupon. Please try again.", "error");
    }
}

function showCouponMessage(message, type) {
    const couponMessage = document.getElementById('couponMessage');
    const icon = type === 'success'
        ? '<i class="fas fa-check-circle"></i>'
        : '<i class="fas fa-exclamation-circle"></i>';

    couponMessage.className = `coupon-message ${type} show`;
    couponMessage.innerHTML = `${icon}<span>${message}</span>`;
}

function hideCouponMessage() {
    const couponMessage = document.getElementById('couponMessage');
    couponMessage.classList.remove("show");
}

function populateFoxyCartCouponField(code) {
    let couponField = document.getElementById("fc-coupon-code");

    if (!couponField) {
        couponField = document.createElement("input");
        couponField.type = "hidden";
        couponField.id = "fc-coupon-code";
        couponField.name = "coupon";
        document.getElementById("foxycart-hidden-fields").appendChild(couponField);
    }

    couponField.value = code;
}

function proceedToPayment() {
    if (validateCurrentStep()) {
        nextStep(7);
    }
}
// ========================================
// Step 7: Final Summary and FoxyCart Integration
// ========================================

function loadFinalSummary() {
    const deviceCount = Object.keys(selectedDevices).length;
    const devicePrice = 300;
    const deviceTotal = deviceCount * devicePrice;
    const addonTotal = calculateAddonTotal(deviceCount);
    const total = deviceTotal + addonTotal;
    
    // Customer Info
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('businessEmail').value;
    const phone = document.getElementById('phoneNumber').value;
    const org = document.getElementById('organizationName').value;
    
    const customerInfo = document.getElementById('receiptCustomerInfo');
    customerInfo.innerHTML = `
        <p><strong>${fullName}</strong></p>
        <p>${org}</p>
        <p>${email}</p>
        <p>${phone}</p>
    `;
    
    // Order Items
    const orderItems = document.getElementById('receiptOrderItems');
    let itemsHTML = '';
    
    // Main product
    itemsHTML += `
        <div class="item-row">
            <div class="item-info">
                <div class="item-name">Cloud Test Go - 1 Month Trial</div>
                <div class="item-details">${deviceCount} devices × $${devicePrice}</div>
            </div>
            <div class="item-price">$${deviceTotal.toLocaleString()}</div>
        </div>
    `;
    
    // Add-ons if any
    if (selectedAddons.length > 0) {
        const addonNames = {
            'automation': 'Automation+',
            'experience': 'Experience+', 
            'performance': 'Performance+'
        };
        const selectedAddonNames = selectedAddons.map(addon => addonNames[addon]);
        
        itemsHTML += `
            <div class="item-row">
                <div class="item-info">
                    <div class="item-name">Add-ons: ${selectedAddonNames.join(', ')}</div>
                    <div class="item-details">${deviceCount} devices</div>
                </div>
                <div class="item-price">$${addonTotal.toLocaleString()}</div>
            </div>
        `;
    }
    
    orderItems.innerHTML = itemsHTML;
    
    // Device Details
    const deviceDetails = getSelectedDeviceDetails();
    document.getElementById('receiptDeviceDetails').innerHTML = deviceDetails.join('<br>');
    
    // Total
    document.getElementById('receiptTotal').textContent = total.toLocaleString();
}

function getSelectedDeviceDetails() {
    const details = [];
    Object.values(selectedDevices).forEach(device => {
        details.push(`${device.name} (${device.type}) - ${device.country}, ${device.city}`);
    });
    return details;
}

function populateFoxyCartFields() {
    // Clear previous cart and add new session ID
    clearPreviousCart();
    addSessionIdToCart();
    
    const deviceCount = Object.keys(selectedDevices).length;
    const devicePrice = 300;
    const billingCycle = '1 Month Trial';
    
    // Calculate addon total per device
    let addonPricePerDevice = 0;
    if (selectedAddons.length === 1) {
        addonPricePerDevice = 100;
    } else if (selectedAddons.length === 2) {
        addonPricePerDevice = 150;
    } else if (selectedAddons.length === 3) {
        addonPricePerDevice = 250;
    }
    
    // Main product details
    const mainProductName = 'Cloud Test Go - 1 Month Trial (per device)';
    const productCode = `cloudtestgo-trial-monthly-${deviceCount}dev`;
    
    // Populate main product fields
    document.getElementById('fc-name').value = mainProductName;
    document.getElementById('fc-price').value = devicePrice.toFixed(2);
    document.getElementById('fc-code').value = productCode;
    document.getElementById('fc-quantity').value = deviceCount.toString();
    
    // Update quantity constraints
    document.querySelector('input[name="quantity_min"]').value = deviceCount.toString();
    document.querySelector('input[name="quantity_max"]').value = deviceCount.toString();
    
    // One-time payment (not subscription)
    document.getElementById('fc-sub-frequency').value = '';
    
    // Customer information
    const fullName = document.getElementById('fullName').value;
    const businessEmail = document.getElementById('businessEmail').value;
    const phoneNumber = document.getElementById('phoneNumber').value;
    const organizationName = document.getElementById('organizationName').value;
    
    const nameParts = fullName.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';
    
    // Pre-populate checkout fields
    document.getElementById('fc-customer-first-name').value = firstName;
    document.getElementById('fc-customer-last-name').value = lastName;
    document.getElementById('fc-customer-email').value = businessEmail;
    document.getElementById('fc-customer-phone').value = phoneNumber;
    document.getElementById('fc-customer-company').value = organizationName;
    
    // IMPORTANT: Also save as custom field for tracking
    document.getElementById('fc-company-name').value = organizationName;
    
    // Billing address fields
    document.getElementById('fc-billing-first-name').value = firstName;
    document.getElementById('fc-billing-last-name').value = lastName;
    document.getElementById('fc-billing-company').value = organizationName;
    document.getElementById('fc-billing-phone').value = phoneNumber;
    
    // Get actual countries and cities from selected devices
    const selectedDeviceIds = Object.keys(selectedDevices);
    const actualCountries = [...new Set(
        selectedDeviceIds.map(deviceId => {
            const device = deviceData.find(d => d.id == deviceId);
            return device ? device.country : null;
        }).filter(country => country !== null)
    )];
    
    const actualCities = [...new Set(
        selectedDeviceIds.map(deviceId => {
            const device = deviceData.find(d => d.id == deviceId);
            return device ? device.city : null;
        }).filter(city => city !== null)
    )];
    
    // Order metadata
    document.getElementById('fc-device-types').value = selectedDeviceTypes.join(', ');
    document.getElementById('fc-selected-countries').value = actualCountries.join(', ');
    document.getElementById('fc-selected-cities').value = actualCities.join(', ');
    document.getElementById('fc-device-count').value = deviceCount.toString();
    document.getElementById('fc-billing-cycle').value = billingCycle;
    
    // Addon names
    const addonNames = {
        'automation': 'Automation+',
        'experience': 'Experience+', 
        'performance': 'Performance+'
    };
    const selectedAddonNames = selectedAddons.map(addon => addonNames[addon]);
    document.getElementById('fc-selected-addons').value = selectedAddonNames.join(', ');
    
    document.getElementById('fc-active-filters').value = activeFilters.join(', ');
    
    // Device details
    const deviceDetails = getSelectedDeviceDetails();
    document.getElementById('fc-selected-devices-json').value = deviceDetails.join('; ');
    
    // Add-ons as second product (if any selected)
    if (selectedAddons.length > 0) {
        const selectedAddonNamesForProduct = selectedAddons.map(addon => {
            const names = {
                'automation': 'Automation+',
                'experience': 'Experience+', 
                'performance': 'Performance+'
            };
            return names[addon];
        });
        
        const addonProductName = `Add-ons: ${selectedAddonNamesForProduct.join(', ')} - 1 Month Trial (per device)`;
        const addonCode = `addons-${selectedAddons.join('-')}-trial-monthly`;
        
        document.getElementById('fc-addon-name').value = addonProductName;
        document.getElementById('fc-addon-price').value = addonPricePerDevice.toFixed(2);
        document.getElementById('fc-addon-code').value = addonCode;
        document.getElementById('fc-addon-quantity').value = deviceCount.toString();
        
        // Update addon quantity constraints
        document.querySelector('input[name="2:quantity_min"]').value = deviceCount.toString();
        document.querySelector('input[name="2:quantity_max"]').value = deviceCount.toString();
    } else {
        // Clear addon fields if no addons selected
        document.getElementById('fc-addon-name').value = '';
        document.getElementById('fc-addon-price').value = '';
        document.getElementById('fc-addon-code').value = '';
        document.getElementById('fc-addon-quantity').value = '';
    }
}

// ========================================
// Enter Key Navigation
// ========================================

function setupEnterKeyNavigation() {
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            // Don't trigger on textareas or if in a modal
            if (e.target.tagName === 'TEXTAREA' || 
                document.querySelector('.modal-overlay.show')) {
                return;
            }
            
            // Check if we're on a step with a next button
            const activeSection = document.querySelector('.form-section.active');
            if (!activeSection) return;
            
            const nextButton = activeSection.querySelector('.btn-primary:not(:disabled)');
            if (nextButton) {
                e.preventDefault();
                nextButton.click();
            }
        }
    });
}

// ========================================
// Form Submission Handler
// ========================================

document.getElementById('foxycart-form')?.addEventListener('submit', function(e) {
    // The form will submit to FoxyCart
    // We can add any last-minute validation or tracking here
    console.log('Form submitting to FoxyCart...');
    
    // Show loading
    showLoading();
    
    // FoxyCart will handle the actual redirect
});

// ========================================
// Initialization
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize progress bar
    updateProgressBar();
    
    // Setup event listeners
    setupDeviceTypeSelection();
    setupDeviceFilters();
    setupAddonSelection();
    setupCouponValidation();
    setupEnterKeyNavigation();
    setupReceiptCouponValidation();
    
    // Set default plan (monthly/trial)
    updatePricingSummary();
    
    console.log('CloudTest Go form initialized successfully');
});