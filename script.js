// ===== GLOBAL VARIABLES =====
let currentStep = 1;
let completedSteps = [];
let selectedDeviceTypes = [];
let selectedCountries = [];
let selectedCities = [];
let selectedDevices = {};
let selectedPlan = 'yearly';
let selectedAddons = [];
let activeFilters = [];
let totalAmount = 0;

// Coupon state
let couponValidated = false;
let validatedCouponCode = '';
let couponTrialDays = 0; // 3 or 7 depending on which coupon was applied

// ===== PRICING CONFIG =====
const PLAN_PRICES = {
    yearly: 1000,
    monthly: 100
};

const ADDON_PRICES = {
    yearly: {
        automation: 200,
        experience: 200,
        performance: 200
    },
    monthly: {
        automation: 25,
        experience: 75,
        performance: 75
    }
};

const BUNDLE_DISCOUNT = 50;

// Coupon validation endpoint (same worker as trial forms)
const COUPON_CHECK_URL = 'https://newtrial.yasir-07a.workers.dev/';

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


// ===== COUNTRY DATA =====
const countryData = {
    'Australia': ['Sydney'],
    'Benin': ['Cotonou'],
    'Brazil': ['São Paulo'],
    'Canada': ['Toronto'],
    'Czech Republic': ['Prague'],
    'France': ['Paris'],
    'Germany': ['Leverkusen'],
    'Great Britain': ['London'],
    'Hong Kong': ['Hong Kong'],
    'India': ['Bangalore'],
    'Indonesia': ['Jakarta'],
    'Ireland': ['Dublin'],
    'Japan': ['Tokyo'],
    'Malaysia': ['Kuala Lumpur'],
    'Netherlands': ['The Hague'],
    'Nigeria': ['Lagos'],
    'Philippines': ['Manila'],
    'Singapore': ['Singapore'],
    'South Africa': ['Johannesburg'],
    'South Korea': ['Seoul'],
    'Taiwan': ['Taipei'],
    'Thailand': ['Bangkok'],
    'Turkey': ['Istanbul'],
    'United Arab Emirates': ['Dubai'],
    'US': ['Atlanta', 'Chicago', 'Newark', 'Palo Alto', 'Riverside', 'Sunnyvale']
};

// ===== UTILITY FUNCTIONS =====
function showLoading() {
    document.getElementById('loadingOverlay').style.display = 'flex';
}

function hideLoading() {
    document.getElementById('loadingOverlay').style.display = 'none';
}

function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(`${fieldId}-error`);
    if (field) field.classList.add('error');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
}

function clearError(fieldId) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(`${fieldId}-error`);
    if (field) field.classList.remove('error');
    if (errorElement) errorElement.classList.remove('show');
}

function clearAllErrors() {
    document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
    document.querySelectorAll('.error-message.show').forEach(el => el.classList.remove('show'));
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const cleanPhone = phone.replace(/[\s\-\(\)\+]/g, '');
    return phone === '' || (/^\d{7,15}$/.test(cleanPhone));
}

// ===== NAVIGATION FUNCTIONS =====
function updateProgressBar() {
    const progress = (currentStep / 7) * 100;
    document.getElementById('progressFill').style.width = `${progress}%`;

    document.querySelectorAll('.step').forEach((step, index) => {
        const stepNumber = index + 1;
        step.classList.remove('active', 'completed');
        if (stepNumber === currentStep) {
            step.classList.add('active');
        } else if (completedSteps.includes(stepNumber)) {
            step.classList.add('completed');
        }
        step.style.cursor = (completedSteps.includes(stepNumber) && stepNumber !== currentStep) ? 'pointer' : 'default';
    });
}

function markStepAsCompleted(stepNumber) {
    if (!completedSteps.includes(stepNumber)) {
        completedSteps.push(stepNumber);
    }
}

function setupStepNavigation() {
    document.querySelectorAll('.step').forEach((step, index) => {
        const stepNumber = index + 1;
        step.addEventListener('click', function() {
            if (completedSteps.includes(stepNumber) && stepNumber < currentStep) {
                goToStep(stepNumber);
            }
        });
    });
}

function nextStep(step) {
    if (validateCurrentStep()) {
        markStepAsCompleted(currentStep);
        showLoading();
        setTimeout(() => {
            hideLoading();
            document.getElementById(`step${currentStep}`).classList.remove('active');
            document.getElementById(`step${step}`).classList.add('active');
            currentStep = step;
            updateProgressBar();
            switch(step) {
                case 3: loadAvailableCountries(); break;
                case 4: loadCitySelections(); break;
                case 5: loadDevices(); break;
                case 6:
                    updatePricingSummary();
                    updateAddonPricing();
                    break;
                case 7: loadFinalSummary(); break;
            }
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 500);
    }
}

function goToStep(targetStep) {
    if (!completedSteps.includes(targetStep) && targetStep >= currentStep) return;
    clearAllErrors();
    document.getElementById(`step${currentStep}`).classList.remove('active');
    document.getElementById(`step${targetStep}`).classList.add('active');
    currentStep = targetStep;
    updateProgressBar();
    switch(targetStep) {
        case 3: loadAvailableCountries(); break;
        case 4: loadCitySelections(); break;
        case 5: loadDevices(); break;
        case 6:
            updatePricingSummary();
            updateAddonPricing();
            break;
        case 7: loadFinalSummary(); break;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function prevStep(step) {
    clearAllErrors();
    document.getElementById(`step${currentStep}`).classList.remove('active');
    document.getElementById(`step${step}`).classList.add('active');
    currentStep = step;
    updateProgressBar();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function validateCurrentStep() {
    clearAllErrors();
    switch(currentStep) {
        case 1: return validateStep1();
        case 2: return validateStep2();
        case 3: return validateStep3();
        case 4: return validateStep4();
        case 5: return validateStep5();
        default: return true;
    }
}

// ===== STEP VALIDATION =====
function validateStep1() {
    let isValid = true;
    const fullName = document.getElementById('fullName').value.trim();
    const businessEmail = document.getElementById('businessEmail').value.trim();
    const phoneNumber = document.getElementById('phoneNumber').value.trim();
    const organizationName = document.getElementById('organizationName').value.trim();

    if (!fullName) { showError('fullName', 'Full name is required'); isValid = false; }
    if (!businessEmail) { showError('businessEmail', 'Business email is required'); isValid = false; }
    else if (!validateEmail(businessEmail)) { showError('businessEmail', 'Please enter a valid email address'); isValid = false; }
    if (!phoneNumber) { showError('phoneNumber', 'Phone number is required'); isValid = false; }
    else if (!validatePhone(phoneNumber)) { showError('phoneNumber', 'Please enter a valid phone number'); isValid = false; }
    if (!organizationName) { showError('organizationName', 'Organization name is required'); isValid = false; }

    return isValid;
}

function validateStep2() {
    if (selectedDeviceTypes.length === 0) { showError('deviceType', 'Please select at least one device type'); return false; }
    return true;
}

function validateStep3() {
    if (selectedCountries.length === 0) { showError('country', 'Please select at least one country'); return false; }
    return true;
}

function validateStep4() {
    if (selectedCities.length === 0) { showError('city', 'Please select at least one city'); return false; }
    return true;
}

function validateStep5() {
    if (Object.keys(selectedDevices).length === 0) { showError('device', 'Please select at least one device'); return false; }
    return true;
}

// ===== DEVICE TYPE SELECTION =====
function setupDeviceTypeSelection() {
    document.querySelectorAll('.selection-card[data-type]').forEach(card => {
        card.addEventListener('click', function(e) {
            if (e.target.type === 'checkbox') return;
            const checkbox = this.querySelector('input[type="checkbox"]');
            const deviceType = this.dataset.type;
            checkbox.checked = !checkbox.checked;
            toggleDeviceType(deviceType, checkbox.checked);
        });
        card.querySelector('input[type="checkbox"]').addEventListener('change', function() {
            toggleDeviceType(card.dataset.type, this.checked);
        });
    });
}

function toggleDeviceType(type, isChecked) {
    const card = document.querySelector(`[data-type="${type}"]`);
    if (isChecked) {
        if (!selectedDeviceTypes.includes(type)) selectedDeviceTypes.push(type);
        card.classList.add('selected');
    } else {
        selectedDeviceTypes = selectedDeviceTypes.filter(t => t !== type);
        card.classList.remove('selected');
    }
    updateDeviceTypeButton();
    clearError('deviceType');
}

function updateDeviceTypeButton() {
    document.getElementById('deviceTypeNext').disabled = selectedDeviceTypes.length === 0;
}

// ===== SELECT ALL COUNTRIES =====
function setupSelectAllCountries() {
    const selectAllCheckbox = document.getElementById('selectAllCountries');
    const selectAllOption = document.querySelector('.select-all-option');
    if (selectAllCheckbox && selectAllOption) {
        selectAllOption.addEventListener('click', function(e) {
            if (e.target.type !== 'checkbox') {
                selectAllCheckbox.checked = !selectAllCheckbox.checked;
                selectAllCheckbox.dispatchEvent(new Event('change'));
            }
        });
        selectAllCheckbox.addEventListener('change', function() {
            const isChecked = this.checked;
            document.querySelectorAll('#countryGrid .selection-card').forEach(card => {
                const checkbox = card.querySelector('input[type="checkbox"]');
                const country = card.dataset.country;
                if (checkbox && country) {
                    checkbox.checked = isChecked;
                    toggleCountry(country, isChecked);
                }
            });
        });
    }
}

// ===== COUNTRY SELECTION =====
function loadAvailableCountries() {
    const availableCountries = [...new Set(
        deviceData.filter(device => selectedDeviceTypes.includes(device.type)).map(device => device.country)
    )].sort();

    const countryGrid = document.getElementById('countryGrid');
    countryGrid.innerHTML = '';

    availableCountries.forEach(country => {
        const deviceCount = deviceData.filter(d => d.country === country && selectedDeviceTypes.includes(d.type)).length;
        const cityCount = countryData[country] ? countryData[country].length : 1;
        const card = document.createElement('div');
        card.className = 'selection-card';
        card.dataset.country = country;
        card.innerHTML = `
            <div class="card-icon"><i class="fas fa-globe"></i></div>
            <div class="card-content">
                <h3>${country}</h3>
                <p>${cityCount} ${cityCount === 1 ? 'city' : 'cities'}</p>
                <span class="device-count">${deviceCount} devices</span>
            </div>
            <div class="card-checkbox">
                <input type="checkbox" id="country-${country.replace(/\s+/g, '')}" value="${country}">
            </div>
        `;
        card.addEventListener('click', function(e) {
            if (e.target.type === 'checkbox') return;
            const checkbox = this.querySelector('input[type="checkbox"]');
            checkbox.checked = !checkbox.checked;
            toggleCountry(country, checkbox.checked);
        });
        card.querySelector('input[type="checkbox"]').addEventListener('change', function() {
            toggleCountry(country, this.checked);
        });
        countryGrid.appendChild(card);
    });

    setupCountrySearch();
    setupSelectAllCountries();
    selectedCountries = [];
    updateCountryButton();
    const selectAllCheckbox = document.getElementById('selectAllCountries');
    if (selectAllCheckbox) selectAllCheckbox.checked = false;
}

function toggleCountry(country, isChecked) {
    const card = document.querySelector(`[data-country="${country}"]`);
    if (isChecked) {
        if (!selectedCountries.includes(country)) selectedCountries.push(country);
        card.classList.add('selected');
    } else {
        selectedCountries = selectedCountries.filter(c => c !== country);
        card.classList.remove('selected');
    }
    updateCountryButton();
    clearError('country');
    const selectAllCheckbox = document.getElementById('selectAllCountries');
    if (selectAllCheckbox) {
        const allCards = document.querySelectorAll('#countryGrid .selection-card');
        const selectedCards = document.querySelectorAll('#countryGrid .selection-card.selected');
        selectAllCheckbox.checked = allCards.length > 0 && selectedCards.length === allCards.length;
    }
}

function updateCountryButton() {
    document.getElementById('countryNext').disabled = selectedCountries.length === 0;
}

function setupCountrySearch() {
    const searchInput = document.getElementById('countrySearch');
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        document.querySelectorAll('#countryGrid .selection-card').forEach(card => {
            const name = card.querySelector('h3').textContent.toLowerCase();
            card.style.display = name.includes(searchTerm) ? 'flex' : 'none';
        });
    });
}

// ===== CITY SELECTION =====
function loadCitySelections() {
    const citySelections = document.getElementById('citySelections');
    citySelections.innerHTML = '';
    selectedCities = [];

    const validCountries = selectedCountries.filter(country =>
        deviceData.some(device => device.country === country && selectedDeviceTypes.includes(device.type))
    );

    validCountries.forEach(country => {
        const availableCities = [...new Set(
            deviceData.filter(device => device.country === country && selectedDeviceTypes.includes(device.type)).map(device => device.city)
        )].sort();

        if (availableCities.length > 0) {
            const citySection = document.createElement('div');
            citySection.className = 'city-section';
            citySection.innerHTML = `
                <h4>${country} Cities</h4>
                <div class="selection-grid">
                    ${availableCities.map(city => {
                        const deviceCount = deviceData.filter(d => d.country === country && d.city === city && selectedDeviceTypes.includes(d.type)).length;
                        return `
                            <div class="selection-card" data-city="${city}" data-country="${country}">
                                <div class="card-icon"><i class="fas fa-map-marker-alt"></i></div>
                                <div class="card-content">
                                    <h3>${city}</h3>
                                    <p>${country}</p>
                                    <span class="device-count">${deviceCount} devices</span>
                                </div>
                                <div class="card-checkbox">
                                    <input type="checkbox" id="city-${city}-${country.replace(/\s+/g, '')}" value="${city}">
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            `;
            citySection.querySelectorAll('.selection-card').forEach(card => {
                card.addEventListener('click', function(e) {
                    if (e.target.type === 'checkbox') return;
                    const checkbox = this.querySelector('input[type="checkbox"]');
                    checkbox.checked = !checkbox.checked;
                    toggleCity(card.dataset.city, checkbox.checked);
                });
                card.querySelector('input[type="checkbox"]').addEventListener('change', function() {
                    toggleCity(card.dataset.city, this.checked);
                });
            });
            citySelections.appendChild(citySection);
        }
    });

    updateCityButton();
}

function toggleCity(city, isChecked) {
    const card = document.querySelector(`[data-city="${city}"]`);
    if (isChecked) {
        if (!selectedCities.includes(city)) selectedCities.push(city);
        card.classList.add('selected');
    } else {
        selectedCities = selectedCities.filter(c => c !== city);
        card.classList.remove('selected');
    }
    updateCityButton();
    clearError('city');
}

function updateCityButton() {
    document.getElementById('cityNext').disabled = selectedCities.length === 0;
}

// ===== DEVICE FILTERING =====
function setupDeviceFilters() {
    document.querySelectorAll('.filter-item').forEach(item => {
        item.addEventListener('click', function() {
            const checkbox = this.querySelector('input[type="checkbox"]');
            const filterType = this.dataset.filter;
            checkbox.checked = !checkbox.checked;
            if (filterType === 'select-all') toggleAllFilters(checkbox.checked);
            else toggleFilter(filterType, checkbox.checked);
        });
        item.querySelector('input[type="checkbox"]').addEventListener('change', function() {
            const filterType = item.dataset.filter;
            if (filterType === 'select-all') toggleAllFilters(this.checked);
            else toggleFilter(filterType, this.checked);
        });
    });
}

function toggleAllFilters(selectAll) {
    document.querySelectorAll('.filter-item:not(.select-all-filters)').forEach(item => {
        const checkbox = item.querySelector('input[type="checkbox"]');
        const filterType = item.dataset.filter;
        checkbox.checked = selectAll;
        if (selectAll) {
            if (!activeFilters.includes(filterType)) activeFilters.push(filterType);
            item.classList.add('active');
        } else {
            activeFilters = activeFilters.filter(f => f !== filterType);
            item.classList.remove('active');
        }
    });
    loadDevices();
}

function toggleFilter(filterType, isActive) {
    const filterItem = document.querySelector(`[data-filter="${filterType}"]`);
    if (isActive) {
        if (!activeFilters.includes(filterType)) activeFilters.push(filterType);
        filterItem.classList.add('active');
    } else {
        activeFilters = activeFilters.filter(f => f !== filterType);
        filterItem.classList.remove('active');
    }
    updateSelectAllFiltersState();
    loadDevices();
}

function updateSelectAllFiltersState() {
    const selectAllCheckbox = document.getElementById('selectAllFilters');
    const allSelected = ['audio', 'wifi', 'sim'].every(f => activeFilters.includes(f));
    if (selectAllCheckbox) selectAllCheckbox.checked = allSelected;
}

// ===== DEVICE SELECTION =====
function loadDevices() {
    let filteredDevices = deviceData.filter(device =>
        selectedDeviceTypes.includes(device.type) &&
        selectedCountries.includes(device.country) &&
        selectedCities.includes(device.city)
    );
    if (activeFilters.includes('audio')) filteredDevices = filteredDevices.filter(d => d.audio);
    if (activeFilters.includes('wifi')) filteredDevices = filteredDevices.filter(d => d.network === 'WiFi');
    if (activeFilters.includes('sim')) filteredDevices = filteredDevices.filter(d => d.network === 'SIM');

    const deviceList = document.getElementById('deviceList');
    deviceList.innerHTML = '';

    if (filteredDevices.length === 0) {
        deviceList.innerHTML = `<div style="text-align:center;padding:3rem;color:var(--text-secondary);">
            <i class="fas fa-search" style="font-size:3rem;margin-bottom:1rem;opacity:0.5;"></i>
            <p>No devices match your current selection and filters.</p>
        </div>`;
        return;
    }

    filteredDevices.forEach(device => {
        const isSelected = selectedDevices[device.id] === 1;
        const deviceItem = document.createElement('div');
        deviceItem.className = `device-item ${isSelected ? 'selected' : ''}`;
        deviceItem.innerHTML = `
            <input type="checkbox" class="device-checkbox" id="device-${device.id}" ${isSelected ? 'checked' : ''}>
            <div class="device-info">
                <h4>${device.name}</h4>
                <p>${device.city}, ${device.country}</p>
                <div class="device-tags">
                    <span class="tag ${device.network.toLowerCase()}">${device.network}</span>
                    <span class="tag ${device.audio ? 'audio' : ''}">${device.audio ? 'Audio' : 'No Audio'}</span>
                </div>
            </div>
        `;
        deviceItem.addEventListener('click', function(e) {
            if (e.target.type === 'checkbox') return;
            const checkbox = this.querySelector('input[type="checkbox"]');
            checkbox.checked = !checkbox.checked;
            toggleDevice(device.id, checkbox.checked);
        });
        deviceItem.querySelector('input[type="checkbox"]').addEventListener('change', function() {
            toggleDevice(device.id, this.checked);
        });
        deviceList.appendChild(deviceItem);
    });

    updateDeviceButton();
}

function toggleDevice(deviceId, isSelected) {
    const deviceItem = document.querySelector(`#device-${deviceId}`).closest('.device-item');
    if (isSelected) {
        selectedDevices[deviceId] = 1;
        deviceItem.classList.add('selected');
    } else {
        delete selectedDevices[deviceId];
        deviceItem.classList.remove('selected');
    }
    updateDeviceButton();
    clearError('device');
    // Coupon only valid for single-device selection
    updateCouponToggleVisibility();
}

function updateDeviceButton() {
    document.getElementById('deviceNext').disabled = Object.keys(selectedDevices).length === 0;
}

// ===== PRICING & PLAN SELECTION =====
function setupPlanSelection() {
    document.querySelectorAll('.plan-card').forEach(card => {
        card.addEventListener('click', function() {
            selectPlan(this.dataset.plan);
        });
    });
}

function selectPlan(plan) {
    selectedPlan = plan;
    document.querySelectorAll('.plan-card').forEach(card => card.classList.remove('selected'));
    document.querySelector(`[data-plan="${plan}"]`).classList.add('selected');

    if (plan === 'yearly') {
        // Reset coupon and hide the section entirely
        resetCoupon();
        const couponSection = document.getElementById('couponSection');
        if (couponSection) couponSection.style.display = 'none';
        const couponToggle = document.getElementById('couponToggle');
        if (couponToggle) couponToggle.checked = false;
        const couponFieldWrapper = document.getElementById('couponFieldWrapper');
        if (couponFieldWrapper) couponFieldWrapper.style.display = 'none';
    } else {
        // Monthly — show only if exactly 1 device selected
        updateCouponToggleVisibility();
    }

    updateAddonPricing();
    updatePricingSummary();
}

/**
 * Show the coupon section ONLY when Monthly plan is selected AND exactly 1 device is selected.
 * Called whenever plan changes or device selection changes.
 */
function updateCouponToggleVisibility() {
    const couponSection = document.getElementById('couponSection');
    if (!couponSection) return;

    const deviceCount = Object.keys(selectedDevices).length;
    const eligible = selectedPlan === 'monthly' && deviceCount === 1;

    if (eligible) {
        couponSection.style.display = 'block';
    } else {
        // Hide and reset if they add more devices or switch plan
        couponSection.style.display = 'none';
        const couponToggle = document.getElementById('couponToggle');
        if (couponToggle && couponToggle.checked) {
            couponToggle.checked = false;
            const couponFieldWrapper = document.getElementById('couponFieldWrapper');
            if (couponFieldWrapper) couponFieldWrapper.style.display = 'none';
            couponSection.classList.remove('open');
        }
        if (couponValidated) {
            resetCoupon();
            updatePricingSummary();
        }
    }
}

function setupAddonSelection() {
    document.querySelectorAll('.addon-card').forEach(card => {
        card.addEventListener('click', function(e) {
            if (e.target.type === 'checkbox') return;
            const checkbox = this.querySelector('input[type="checkbox"]');
            const addon = this.dataset.addon;
            checkbox.checked = !checkbox.checked;
            toggleAddon(addon, checkbox.checked);
        });
        card.querySelector('input[type="checkbox"]').addEventListener('change', function() {
            toggleAddon(card.dataset.addon, this.checked);
        });
    });
}

function toggleAddon(addon, isSelected) {
    const card = document.querySelector(`[data-addon="${addon}"]`);
    if (isSelected) {
        if (!selectedAddons.includes(addon)) selectedAddons.push(addon);
        card.classList.add('selected');
    } else {
        selectedAddons = selectedAddons.filter(a => a !== addon);
        card.classList.remove('selected');
    }
    updatePricingSummary();
}

function updateAddonPricing() {
    const automationPrice = document.getElementById('automation-price');
    const experiencePrice = document.getElementById('experience-price');
    const performancePrice = document.getElementById('performance-price');

    if (selectedPlan === 'yearly') {
        if (automationPrice) automationPrice.textContent = '$200/device/year';
        if (experiencePrice) experiencePrice.textContent = '$200/device/year';
        if (performancePrice) performancePrice.textContent = '$200/device/year';
    } else {
        if (automationPrice) automationPrice.textContent = '$25/device/month';
        if (experiencePrice) experiencePrice.textContent = '$75/device/month';
        if (performancePrice) performancePrice.textContent = '$75/device/month';
    }
}

function calculateAddonTotal(deviceCount) {
    if (selectedAddons.length === 0) return 0;
    const prices = ADDON_PRICES[selectedPlan];
    let sumPerDevice = selectedAddons.reduce((sum, addon) => sum + (prices[addon] || 0), 0);
    if (selectedAddons.length === 3) sumPerDevice -= BUNDLE_DISCOUNT;
    return deviceCount * sumPerDevice;
}

function getAddonPricePerDevice() {
    if (selectedAddons.length === 0) return 0;
    const prices = ADDON_PRICES[selectedPlan];
    let sumPerDevice = selectedAddons.reduce((sum, addon) => sum + (prices[addon] || 0), 0);
    if (selectedAddons.length === 3) sumPerDevice -= BUNDLE_DISCOUNT;
    return sumPerDevice;
}

function updatePricingSummary() {
    const deviceCount = Object.keys(selectedDevices).length;
    const devicePrice = PLAN_PRICES[selectedPlan];
    const deviceTotal = deviceCount * devicePrice;
    const addonTotal = calculateAddonTotal(deviceCount);
    totalAmount = deviceTotal + addonTotal;

    const addonLabels = { automation: 'Automation+', experience: 'Experience+', performance: 'Performance+' };
    let addonDescription = '';
    if (selectedAddons.length > 0) {
        const selectedAddonNames = selectedAddons.map(a => addonLabels[a]);
        const addonPricePerDevice = getAddonPricePerDevice();
        let discountNote = selectedAddons.length === 3 ? ' <em>($50/device bundle discount applied)</em>' : '';
        addonDescription = `<p><strong>${selectedAddonNames.join(', ')}</strong> × <strong>${deviceCount}</strong> devices @ <strong>$${addonPricePerDevice}/device</strong> = <strong>$${addonTotal.toLocaleString()}</strong>${discountNote}</p>`;
    }

    const orderDetails = document.getElementById('orderDetails');
    if (orderDetails) {
        let couponNote = '';
        if (couponValidated) {
            couponNote = `
                <div class="coupon-applied-notice">
                    <i class="fas fa-tag"></i>
                    <strong>Coupon "${validatedCouponCode}" applied</strong> — ${couponTrialDays}-day free trial activated. $0 due today.
                </div>`;
        }
        orderDetails.innerHTML = `
            <p><strong>Cloud<i>Test</i> Go</strong> – <strong>${deviceCount}</strong> devices × <strong>$${devicePrice}</strong> = <strong>$${deviceTotal.toLocaleString()}</strong></p>
            ${addonDescription}
            ${couponNote}
        `;
    }

    const totalAmountElement = document.getElementById('totalAmount');
    if (totalAmountElement) {
        if (couponValidated) {
            totalAmountElement.innerHTML = `<span style="text-decoration:line-through;opacity:0.5;font-size:0.85em;">$${totalAmount.toLocaleString()}</span> <span style="color:var(--success-color,#22c55e);">$0</span>`;
        } else {
            totalAmountElement.textContent = totalAmount.toLocaleString();
        }
    }
}

// ===== COUPON VALIDATION =====

/**
 * Set up the "Do you have a coupon code?" toggle and coupon input field.
 * The toggle is only visible when Monthly plan is selected.
 */
function setupCouponToggle() {
    const couponToggle = document.getElementById('couponToggle');
    const couponFieldWrapper = document.getElementById('couponFieldWrapper');
    const couponSection = document.getElementById('couponSection');

    if (!couponToggle || !couponFieldWrapper) return;

    couponToggle.addEventListener('change', function() {
        if (this.checked) {
            // Auto-select monthly when toggle is turned on
            selectPlan('monthly');
            couponFieldWrapper.style.display = 'block';
            if (couponSection) couponSection.classList.add('open');
        } else {
            couponFieldWrapper.style.display = 'none';
            if (couponSection) couponSection.classList.remove('open');
            resetCoupon();
            updatePricingSummary();
        }
    });

    // Apply button
    const applyBtn = document.getElementById('couponApplyBtn');
    if (applyBtn) applyBtn.addEventListener('click', validateCoupon);

    // Enter key in input
    const couponInput = document.getElementById('couponCodeInput');
    if (couponInput) {
        couponInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') { e.preventDefault(); validateCoupon(); }
        });
        couponInput.addEventListener('input', function() {
            if (couponValidated) {
                resetCoupon();
                updatePricingSummary();
            }
        });
    }
}

async function validateCoupon() {
    const couponInput = document.getElementById('couponCodeInput');
    const applyBtn = document.getElementById('couponApplyBtn');
    const loadingEl = document.getElementById('couponValidationLoading');

    const couponCode = couponInput.value.trim().toUpperCase();
    const email = document.getElementById('businessEmail').value.trim();

    if (!couponCode) {
        showCouponMessage('Please enter a coupon code.', 'error');
        return;
    }
    if (!email || !email.includes('@')) {
        showCouponMessage('Please enter your business email in Step 1 first.', 'error');
        return;
    }

    const emailDomain = email.split('@')[1].toLowerCase();

    if (loadingEl) loadingEl.classList.add('show');
    if (applyBtn) applyBtn.disabled = true;
    couponInput.disabled = true;
    hideCouponMessage();

    try {
        const response = await fetch(COUPON_CHECK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ emailDomain, couponCode })
        });
        const result = await response.json();

        if (loadingEl) loadingEl.classList.remove('show');
        if (applyBtn) applyBtn.disabled = false;
        couponInput.disabled = false;

        if (result.allowed) {
            couponValidated = true;
            validatedCouponCode = couponCode;

            // trialDays comes from the worker — no coupon code logic in frontend
            couponTrialDays = result.trialDays || 3;

            couponInput.classList.add('valid');
            couponInput.classList.remove('invalid');
            showCouponMessage(result.message, 'success');

            const badge = document.getElementById('couponAppliedBadge');
            if (badge) badge.classList.add('show');

            populateFoxyCartCouponField(couponCode);
            updatePricingSummary();
        } else {
            couponValidated = false;
            validatedCouponCode = '';
            couponTrialDays = 0;
            couponInput.classList.add('invalid');
            couponInput.classList.remove('valid');
            showCouponMessage(result.message || 'Invalid or expired coupon code.', 'error');

            const badge = document.getElementById('couponAppliedBadge');
            if (badge) badge.classList.remove('show');
            updatePricingSummary();
        }
    } catch (err) {
        if (loadingEl) loadingEl.classList.remove('show');
        if (applyBtn) applyBtn.disabled = false;
        couponInput.disabled = false;
        showCouponMessage('Error validating coupon. Please try again.', 'error');
    }
}

function showCouponMessage(message, type) {
    const messageEl = document.getElementById('couponValidationMessage');
    if (!messageEl) return;
    const icon = type === 'success' ? '<i class="fas fa-check-circle"></i>' : '<i class="fas fa-exclamation-circle"></i>';
    messageEl.className = `coupon-message ${type} show`;
    messageEl.innerHTML = `${icon} <span>${message}</span>`;
}

function hideCouponMessage() {
    const messageEl = document.getElementById('couponValidationMessage');
    if (messageEl) messageEl.classList.remove('show');
}

function resetCoupon() {
    couponValidated = false;
    validatedCouponCode = '';
    couponTrialDays = 0;
    const couponInput = document.getElementById('couponCodeInput');
    if (couponInput) {
        couponInput.value = '';
        couponInput.classList.remove('valid', 'invalid');
        couponInput.disabled = false;
    }
    hideCouponMessage();
    const badge = document.getElementById('couponAppliedBadge');
    if (badge) badge.classList.remove('show');
    const couponField = document.getElementById('fc-coupon-code');
    if (couponField) couponField.value = '';
}

function populateFoxyCartCouponField(code) {
    let couponField = document.getElementById('fc-coupon-code');
    if (!couponField) {
        couponField = document.createElement('input');
        couponField.type = 'hidden';
        couponField.id = 'fc-coupon-code';
        couponField.name = 'coupon';
        document.getElementById('foxycart-hidden-fields').appendChild(couponField);
    }
    couponField.value = code;
}

// ===== HELPER =====
function getSelectedDeviceDetails() {
    return Object.keys(selectedDevices).map(deviceId => {
        const device = deviceData.find(d => d.id == deviceId);
        return device ? `${device.name} | ${device.country} | ${device.city}` : '';
    }).filter(d => d !== '');
}

// ===== SESSION MANAGEMENT =====
function generateSessionId() {
    return `${Date.now()}${Math.floor(Math.random() * 10000)}`;
}

function addEmptyCartParameter() {
    const sessionId = generateSessionId();

    const existingEmptyField = document.querySelector('input[name="empty"]');
    if (existingEmptyField) existingEmptyField.remove();

    const emptyCartField = document.createElement('input');
    emptyCartField.type = 'hidden';
    emptyCartField.name = 'empty';
    emptyCartField.value = 'true';

    const existingSessionField = document.querySelector('input[name="session_id"]');
    if (existingSessionField) existingSessionField.remove();

    const sessionField = document.createElement('input');
    sessionField.type = 'hidden';
    sessionField.name = 'session_id';
    sessionField.value = sessionId;

    const hiddenFieldsContainer = document.getElementById('foxycart-hidden-fields');
    hiddenFieldsContainer.appendChild(emptyCartField);
    hiddenFieldsContainer.appendChild(sessionField);
}

// ===== FOXYCART INTEGRATION =====
function populateFoxyCartFields() {
    const deviceCount = Object.keys(selectedDevices).length;
    const addonPricePerDevice = getAddonPricePerDevice();

    // When a coupon is validated on monthly: treat as a one-time free trial
    // — no subscription, billing cycle label changes, price is $0
    const isCouponTrial = couponValidated && selectedPlan === 'monthly';
    const trialLabel = `${couponTrialDays} Day Free Trial`;
    const billingCycle = isCouponTrial ? trialLabel
                       : selectedPlan === 'monthly' ? 'monthly'
                       : 'yearly';

    const effectiveDevicePrice = isCouponTrial ? 0 : PLAN_PRICES[selectedPlan];
    const effectiveAddonPrice  = isCouponTrial ? 0 : addonPricePerDevice;

    const mainProductName = isCouponTrial
        ? `Cloud Test Go - ${trialLabel} (per device)`
        : `Cloud Test Go - ${billingCycle.charAt(0).toUpperCase() + billingCycle.slice(1)} Plan (per device)`;
    const productCode = isCouponTrial
        ? `cloudtestgo-${couponTrialDays}day-trial-${deviceCount}dev`
        : `cloudtestgo-${billingCycle}-${deviceCount}dev`;

    document.getElementById('fc-name').value = mainProductName;
    document.getElementById('fc-price').value = effectiveDevicePrice.toFixed(2);
    document.getElementById('fc-code').value = productCode;
    document.getElementById('fc-quantity').value = deviceCount.toString();

    document.querySelector('input[name="quantity_min"]').value = deviceCount.toString();
    document.querySelector('input[name="quantity_max"]').value = deviceCount.toString();

    // No recurring subscription when it's a coupon-driven trial
    document.getElementById('fc-sub-frequency').value = isCouponTrial ? '' : (selectedPlan === 'monthly' ? '1m' : '1y');

    const fullName = document.getElementById('fullName').value;
    const businessEmail = document.getElementById('businessEmail').value;
    const phoneNumber = document.getElementById('phoneNumber').value;
    const organizationName = document.getElementById('organizationName').value;
    const nameParts = fullName.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    document.getElementById('fc-customer-first-name').value = firstName;
    document.getElementById('fc-customer-last-name').value = lastName;
    document.getElementById('fc-customer-email').value = businessEmail;
    document.getElementById('fc-customer-phone').value = phoneNumber;
    document.getElementById('fc-customer-company').value = organizationName;
    document.getElementById('fc-billing-first-name').value = firstName;
    document.getElementById('fc-billing-last-name').value = lastName;
    document.getElementById('fc-billing-company').value = organizationName;
    document.getElementById('fc-billing-phone').value = phoneNumber;

    const selectedDeviceIds = Object.keys(selectedDevices);
    const actualCountries = [...new Set(selectedDeviceIds.map(id => { const d = deviceData.find(x => x.id == id); return d ? d.country : null; }).filter(Boolean))];
    const actualCities = [...new Set(selectedDeviceIds.map(id => { const d = deviceData.find(x => x.id == id); return d ? d.city : null; }).filter(Boolean))];

    document.getElementById('fc-device-types').value = selectedDeviceTypes.join(', ');
    document.getElementById('fc-selected-countries').value = actualCountries.join(', ');
    document.getElementById('fc-selected-cities').value = actualCities.join(', ');
    document.getElementById('fc-device-count').value = deviceCount.toString();
    document.getElementById('fc-billing-cycle').value = billingCycle;

    const addonLabels = { automation: 'Automation+', experience: 'Experience+', performance: 'Performance+' };
    const selectedAddonNames = selectedAddons.map(a => addonLabels[a]);
    document.getElementById('fc-selected-addons').value = selectedAddonNames.join(', ');
    document.getElementById('fc-active-filters').value = activeFilters.join(', ');
    document.getElementById('fc-selected-devices-json').value = getSelectedDeviceDetails().join('; ');

    if (selectedAddons.length > 0) {
        const addonProductName = isCouponTrial
            ? `Add-ons: ${selectedAddonNames.join(', ')} - ${trialLabel} (per device)`
            : `Add-ons: ${selectedAddonNames.join(', ')} - ${billingCycle.charAt(0).toUpperCase() + billingCycle.slice(1)} (per device)`;
        const addonCode = isCouponTrial
            ? `addons-${selectedAddons.join('-')}-${couponTrialDays}day-trial`
            : `addons-${selectedAddons.join('-')}-${billingCycle}`;
        document.getElementById('fc-addon-name').value = addonProductName;
        document.getElementById('fc-addon-price').value = effectiveAddonPrice.toFixed(2);
        document.getElementById('fc-addon-code').value = addonCode;
        document.getElementById('fc-addon-quantity').value = deviceCount.toString();
        document.querySelector('input[name="2:quantity_min"]').value = deviceCount.toString();
        document.querySelector('input[name="2:quantity_max"]').value = deviceCount.toString();
    } else {
        document.getElementById('fc-addon-name').value = '';
        document.getElementById('fc-addon-price').value = '';
        document.getElementById('fc-addon-code').value = '';
        document.getElementById('fc-addon-quantity').value = '';
    }
}

// ===== PAYMENT & COMPLETION =====
function proceedToPayment() {
    nextStep(7);
}

function generateReceiptNumber() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `CTG-${year}${month}${day}-${randomNum}`;
}

function loadFinalSummary() {
    const deviceCount = Object.keys(selectedDevices).length;
    const devicePrice = PLAN_PRICES[selectedPlan];
    const deviceTotal = deviceCount * devicePrice;
    const addonTotal = calculateAddonTotal(deviceCount);
    const addonPricePerDevice = getAddonPricePerDevice();

    const selectedDeviceIds = Object.keys(selectedDevices);
    const actualDeviceTypes = [...new Set(selectedDeviceIds.map(id => { const d = deviceData.find(x => x.id == id); return d ? d.type : null; }).filter(Boolean))];
    const actualCountries = [...new Set(selectedDeviceIds.map(id => { const d = deviceData.find(x => x.id == id); return d ? d.country : null; }).filter(Boolean))];

    const receiptNumberElement = document.getElementById('receiptNumber');
    if (receiptNumberElement) receiptNumberElement.textContent = generateReceiptNumber();

    // Customer info
    const customerInfo = document.getElementById('receiptCustomerInfo');
    if (customerInfo) {
        customerInfo.innerHTML = `
            <div class="customer-info-grid">
                <div class="info-item"><div class="info-label">Full Name</div><div class="info-value">${document.getElementById('fullName').value}</div></div>
                <div class="info-item"><div class="info-label">Email</div><div class="info-value">${document.getElementById('businessEmail').value}</div></div>
                <div class="info-item"><div class="info-label">Phone</div><div class="info-value">${document.getElementById('phoneNumber').value}</div></div>
                <div class="info-item"><div class="info-label">Organization</div><div class="info-value">${document.getElementById('organizationName').value}</div></div>
            </div>
        `;
    }

    // Order items
    const orderItems = document.getElementById('receiptOrderItems');
    if (orderItems) {
        let itemsHTML = '';

        const isCouponTrial = couponValidated && selectedPlan === 'monthly';
        const planLabel = isCouponTrial ? `${couponTrialDays} Day Free Trial`
                        : selectedPlan === 'yearly' ? 'Yearly' : 'Monthly';

        const displayDevicePrice = isCouponTrial
            ? `<span style="text-decoration:line-through;opacity:0.5;">$${deviceTotal.toLocaleString()}</span> <span style="color:var(--success-color,#22c55e);">$0</span>`
            : `$${deviceTotal.toLocaleString()}`;

        itemsHTML += `
            <div class="item-row">
                <div class="item-info">
                    <div class="item-name">Cloud Test Go – ${planLabel}</div>
                    <div class="item-description">${deviceCount} ${deviceCount === 1 ? 'device' : 'devices'} × $${devicePrice.toLocaleString()}/device</div>
                    <div class="item-details">
                        <div class="item-detail">${actualDeviceTypes.join(', ')}</div>
                        <div class="item-detail">${actualCountries.length} ${actualCountries.length === 1 ? 'country' : 'countries'}</div>
                    </div>
                </div>
                <div class="item-price">${displayDevicePrice}</div>
            </div>
        `;

        if (selectedAddons.length > 0) {
            const addonLabels = { automation: 'Automation+', experience: 'Experience+', performance: 'Performance+' };
            const selectedAddonNames = selectedAddons.map(a => addonLabels[a]);
            let discountNote = selectedAddons.length === 3 ? `<div class="item-detail" style="color:var(--success-color,#22c55e);">$50/device bundle discount applied</div>` : '';
            const displayAddonPrice = isCouponTrial
                ? `<span style="text-decoration:line-through;opacity:0.5;">$${addonTotal.toLocaleString()}</span> <span style="color:var(--success-color,#22c55e);">$0</span>`
                : `$${addonTotal.toLocaleString()}`;

            itemsHTML += `
                <div class="item-row">
                    <div class="item-info">
                        <div class="item-name">Add-ons: ${selectedAddonNames.join(', ')}</div>
                        <div class="item-description">${deviceCount} ${deviceCount === 1 ? 'device' : 'devices'} × $${addonPricePerDevice}/device – ${planLabel}</div>
                        <div class="item-details">
                            ${selectedAddonNames.map(name => `<div class="item-detail">${name}</div>`).join('')}
                            ${discountNote}
                        </div>
                    </div>
                    <div class="item-price">${displayAddonPrice}</div>
                </div>
            `;
        }

        // Coupon applied notice
        if (isCouponTrial) {
            itemsHTML += `
                <div class="item-row coupon-row" style="background:rgba(34,197,94,0.08);border-radius:8px;padding:0.75rem 1rem;">
                    <div class="item-info">
                        <div class="item-name" style="color:var(--success-color,#22c55e);">
                            <i class="fas fa-tag"></i> Coupon: ${validatedCouponCode}
                        </div>
                        <div class="item-description">${couponTrialDays}-day free trial — $0 due today</div>
                    </div>
                    <div class="item-price" style="color:var(--success-color,#22c55e);">–$${totalAmount.toLocaleString()}</div>
                </div>
            `;
        }

        orderItems.innerHTML = itemsHTML;
    }

    // Device details
    const deviceDetails = getSelectedDeviceDetails();
    const deviceDetailsContainer = document.getElementById('receiptDeviceDetails');
    if (deviceDetailsContainer) {
        deviceDetailsContainer.innerHTML = deviceDetails.map((detail, i) => `
            <div class="device-detail-item">
                <div class="device-number">${i + 1}</div>
                <div class="device-detail-info">${detail}</div>
            </div>
        `).join('');
    }

    // Total
    const totalElement = document.getElementById('receiptTotal');
    if (totalElement) {
        if (couponValidated && selectedPlan === 'monthly') {
            totalElement.innerHTML = `<span style="text-decoration:line-through;opacity:0.5;font-size:0.85em;">$${totalAmount.toLocaleString()}</span> <span style="color:var(--success-color,#22c55e);font-size:1.1em;">$0</span>`;
        } else {
            totalElement.textContent = totalAmount.toLocaleString();
        }
    }

    populateFoxyCartFields();
}

// ===== ENTER KEY NAVIGATION =====
function setupEnterKeyNavigation() {
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && currentStep < 7) {
            e.preventDefault();
            const focusedElement = document.activeElement;
            if (focusedElement && focusedElement.tagName === 'INPUT') {
                if (currentStep === 6) proceedToPayment();
                else if (validateCurrentStep()) nextStep(currentStep + 1);
            }
        }
    });
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    updateProgressBar();
    setupDeviceTypeSelection();
    setupDeviceFilters();
    setupPlanSelection();
    setupAddonSelection();
    setupCouponToggle();
    selectPlan('yearly');
    setupEnterKeyNavigation();

    const form = document.getElementById('foxycart-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            if (currentStep < 7) { e.preventDefault(); return false; }
            addEmptyCartParameter();
            populateFoxyCartFields();
            return true;
        });
    }

    console.log('CloudTest Go purchase form initialized successfully!');
});

window.nextStep = nextStep;
window.prevStep = prevStep;
window.proceedToPayment = proceedToPayment;