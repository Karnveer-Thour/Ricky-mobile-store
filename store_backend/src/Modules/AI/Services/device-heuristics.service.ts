import { Injectable } from '@nestjs/common';
import { AIEnrichedProduct, DEVICE_IMAGE_PRESETS } from '../Constants/device-presets.constants';

@Injectable()
export class DeviceHeuristicsService {
  /**
   * Smart Device Catalog Heuristics with Flipkart-Style Specs & Multi-Image Gallery
   */
  getOfflineEnrichedProduct(
    name: string,
    category?: string,
    price?: number | string,
  ): AIEnrichedProduct {
    const lower = (name || '').toLowerCase();

    let matchedImages = DEVICE_IMAGE_PRESETS.generic_phone;
    let description = `${name} is engineered for exceptional performance, featuring high-speed processing, stunning vibrant visuals, studio-grade imaging, and long-lasting all-day battery life.`;
    let warranty = '1 Year Official Brand Warranty for Device and 6 Months for In-Box Accessories';
    let specifications = `• RAM & Storage: 8 GB RAM | 128 GB ROM\n• Processor: Octa-Core High Performance Processor\n• Display: 6.67 inch Full HD+ 120Hz AMOLED Display\n• Rear Camera: 50MP (OIS) + 8MP (Ultra-Wide) Dual Camera\n• Front Camera: 16MP Selfie Camera\n• Battery & Charging: 5000 mAh Battery with 67W Fast Turbo Charge\n• OS: Android 14 with 5G Dual SIM Support\n• In The Box: Handset, Power Adapter, USB-C Cable, SIM Ejector, Protective Case`;

    let colors: Array<{ name: string; quantity: number }> = [{ name: 'Default', quantity: 15 }];

    // 1. Apple iPhone Ecosystem
    if (lower.includes('iphone') || lower.includes('apple')) {
      warranty =
        '1 Year Official Apple Brand Warranty for Device and 6 Months for In-Box Accessories';
      if (lower.includes('pro') || lower.includes('max')) {
        matchedImages = DEVICE_IMAGE_PRESETS.iphone_pro;
        description = `Forged in aerospace-grade titanium, ${name} features the groundbreaking A17 Pro / A18 Pro Bionic chip, customizable Action button, the most versatile iPhone camera system with 5x optical telephoto zoom, and Super Retina XDR display with ProMotion 120Hz.`;
        specifications = `• RAM & Storage: 8 GB RAM | 256 GB NVMe High-Speed Storage\n• Processor: Apple A17 Pro (3nm Hexa-Core) with 6-Core Pro GPU & Hardware Ray Tracing\n• Display: 6.7 inch Super Retina XDR OLED Display (120Hz ProMotion, 2000 nits Peak, Always-On, Ceramic Shield)\n• Rear Camera: 48MP (OIS Quad-Pixel) + 12MP (5x Telephoto) + 12MP (Ultra-Wide with Macro) with 4K ProRes Video\n• Front Camera: 12MP TrueDepth Camera with Autofocus & Face ID\n• Battery & Charging: Up to 29 Hours Video Playback with MagSafe 15W Wireless Charging & USB-C 3.0\n• OS: iOS 17 / iOS 18 with Apple Intelligence Support\n• In The Box: iPhone, USB-C Charge Cable (1m), Documentation`;
        colors = [
          { name: 'Natural Titanium', quantity: 15 },
          { name: 'Titanium Black', quantity: 15 },
          { name: 'Titanium White', quantity: 10 },
          { name: 'Titanium Blue', quantity: 10 },
        ];
      } else {
        matchedImages = DEVICE_IMAGE_PRESETS.iphone;
        description = `${name} brings Dynamic Island, 48MP Main camera with 2x Telephoto, durable color-infused glass and aluminum design, and USB-C connectivity with all-day battery life.`;
        specifications = `• RAM & Storage: 6 GB RAM | 128 GB NVMe Storage\n• Processor: Apple A16 Bionic (5-Core GPU)\n• Display: 6.1 inch Super Retina XDR OLED Display (Dynamic Island, HDR10, 2000 nits)\n• Rear Camera: 48MP Main + 12MP Ultra-Wide Dual Camera System\n• Front Camera: 12MP TrueDepth Camera with 4K Dolby Vision\n• Battery: All-day battery life with 20W Fast Charging & 15W MagSafe\n• OS: iOS 17 / iOS 18 with satellite Emergency SOS\n• In The Box: iPhone, USB-C Charge Cable, Documentation`;
        colors = [
          { name: 'Midnight Black', quantity: 15 },
          { name: 'Starlight White', quantity: 12 },
          { name: 'Deep Blue', quantity: 8 },
          { name: 'Light Green', quantity: 5 },
        ];
      }
    }
    // 2. Samsung Galaxy
    else if (lower.includes('samsung') || lower.includes('galaxy')) {
      warranty = '1 Year Official Samsung India Warranty for Handset and 6 Months for Accessories';
      if (lower.includes('ultra') || lower.includes('s24') || lower.includes('s23')) {
        matchedImages = DEVICE_IMAGE_PRESETS.samsung_ultra;
        description = `Welcome to the era of Galaxy AI. ${name} features a durable titanium frame, integrated S-Pen stylus, 200MP quad-telephoto camera system with Nightography zoom, and the ultra-bright Dynamic AMOLED 2X flat display.`;
        specifications = `• RAM & Storage: 12 GB LPDDR5X RAM | 512 GB UFS 4.0 Storage\n• Processor: Snapdragon 8 Gen 3 for Galaxy (4nm Octa-Core up to 3.39 GHz)\n• Display: 6.8 inch Quad HD+ Dynamic AMOLED 2X (1-120Hz LTPO, 2600 nits, Corning Gorilla Armor)\n• Rear Camera: 200MP (OIS) + 50MP (5x Periscope) + 10MP (3x Telephoto) + 12MP (Ultra-Wide) with 100x Space Zoom\n• Front Camera: 12MP Dual-Pixel Autofocus Selfie Camera\n• Battery & Charging: 5000 mAh Battery with 45W Fast Charging & 15W Wireless PowerShare\n• OS: Android 14 / One UI 6.1 with 7 Years of OS & Security Updates\n• In The Box: Handset, S-Pen Stylus, Data Cable (Type-C to Type-C), SIM Ejector Pin`;
        colors = [
          { name: 'Titanium Gray', quantity: 15 },
          { name: 'Titanium Black', quantity: 12 },
          { name: 'Titanium Violet', quantity: 8 },
          { name: 'Titanium Yellow', quantity: 5 },
        ];
      } else {
        matchedImages = DEVICE_IMAGE_PRESETS.samsung;
        description = `${name} combines a vibrant 120Hz Super AMOLED display, high-resolution multi-lens camera with OIS, 5000mAh long-lasting battery, and Knox defense-grade security.`;
        specifications = `• RAM & Storage: 8 GB RAM | 256 GB Storage (Expandable up to 1 TB)\n• Processor: Exynos 1480 / Snapdragon Octa-Core Processor\n• Display: 6.6 inch Full HD+ Super AMOLED 120Hz Display\n• Rear Camera: 50MP (OIS) + 12MP (Ultra-Wide) + 5MP (Macro) Triple Camera\n• Front Camera: 32MP High-Res Selfie Camera\n• Battery & Charging: 5000 mAh Battery with 25W Fast Charging\n• OS: Android 14 with IP67 Water and Dust Resistance\n• In The Box: Handset, USB Type-C Cable, Ejection Pin, Quick Guide`;
        colors = [
          { name: 'Awesome Navy', quantity: 15 },
          { name: 'Awesome Iceblue', quantity: 12 },
          { name: 'Awesome Lilac', quantity: 8 },
        ];
      }
    }
    // 3. OnePlus
    else if (lower.includes('oneplus')) {
      warranty = '1 Year OnePlus Official Warranty for Phone and 6 Months for In-Box Charger';
      matchedImages = DEVICE_IMAGE_PRESETS.oneplus;
      description = `${name} delivers pure flagship speed, 4th Gen Hasselblad Camera for Mobile, 2K 120Hz ProXDR display, Dual Cryo-velocity VC cooling, and ultra-fast 100W SUPERVOOC charging.`;
      specifications = `• RAM & Storage: 16 GB LPDDR5X RAM | 512 GB UFS 4.0 ROM\n• Processor: Snapdragon 8 Gen 3 (4nm) with Adreno 750 GPU\n• Display: 6.82 inch 2K 120Hz ProXDR LTPO 4.0 AMOLED Display (4500 nits Peak)\n• Rear Camera: 50MP Sony LYT-808 (OIS) + 64MP 3x Periscope Telephoto + 48MP Ultra-Wide\n• Front Camera: 32MP 4K Video Selfie Camera\n• Battery & Charging: 5400 mAh Battery with 100W SUPERVOOC Fast Charge (1-100% in 26 mins)\n• OS: OxygenOS 14 based on Android 14\n• In The Box: Handset, 100W SUPERVOOC Power Adapter, Type-C Cable, Quick Guide, SIM Tray Ejector`;
      colors = [
        { name: 'Flowy Emerald', quantity: 15 },
        { name: 'Silky Black', quantity: 15 },
        { name: 'Cool Blue', quantity: 8 },
      ];
    }
    // 4. Xiaomi / Redmi
    else if (lower.includes('redmi') || lower.includes('xiaomi') || lower.includes('poco')) {
      warranty = '1 Year Xiaomi Official Warranty for Handset and 6 Months for In-Box Adapter';
      matchedImages = DEVICE_IMAGE_PRESETS.xiaomi;
      description = `${name} brings 200MP ultra-clear camera with OIS, 1.5K 120Hz curved AMOLED eye-care display, high-speed 5G connectivity, and 67W / 120W Turbo Charging.`;
      specifications = `• RAM & Storage: 8 GB RAM | 256 GB UFS 3.1 Storage\n• Processor: MediaTek Dimensity 7200-Ultra / Snapdragon 7s Gen 2 (4nm Octa-Core)\n• Display: 6.67 inch 1.5K 120Hz CrystalRes 3D Curved AMOLED Display (1800 nits, Dolby Vision)\n• Rear Camera: 200MP Samsung ISOCELL HP3 (OIS) + 8MP Ultra-Wide + 2MP Macro\n• Front Camera: 16MP In-Display Front Camera\n• Battery & Charging: 5000 mAh Battery with 67W / 120W Turbo Charge (In-Box Charger)\n• OS: Xiaomi HyperOS / MIUI based on Android 14 (IP68 Water Resistant)\n• In The Box: Handset, 67W Power Adapter, USB Type-C Cable, SIM Eject Tool, Protective Case`;
      colors = [
        { name: 'Midnight Black', quantity: 15 },
        { name: 'Glacier Blue', quantity: 12 },
        { name: 'Aurora Green', quantity: 8 },
      ];
    }
    // 5. Google Pixel
    else if (lower.includes('pixel') || lower.includes('google')) {
      warranty = '1 Year Google Hardware Limited Warranty';
      matchedImages = DEVICE_IMAGE_PRESETS.google_pixel;
      description = `${name} is engineered by Google with the powerful Tensor G3/G4 chip, revolutionary AI photo capabilities like Best Take and Magic Editor, and up to 7 years of Pixel drops.`;
      specifications = `• RAM & Storage: 12 GB LPDDR5X RAM | 256 GB UFS 3.1 Storage\n• Processor: Google Tensor G3 with Titan M2 Security Coprocessor\n• Display: 6.7 inch Super Actua LTPO OLED Display (1-120Hz, 2400 nits)\n• Rear Camera: 50MP Octa PD (OIS) + 48MP Quad PD Telephoto (5x) + 48MP Ultra-Wide with Macro Focus\n• Front Camera: 10.5MP Dual PD Selfie Camera with Autofocus\n• Battery & Charging: 5050 mAh Battery with 30W Fast Charging & Qi Wireless Charging\n• OS: Android 14 with 7 Years of Feature Drops & Security Updates\n• In The Box: Pixel Smartphone, 1m USB-C to USB-C Cable, Quick Switch Adapter, SIM Tool`;
      colors = [
        { name: 'Obsidian Black', quantity: 15 },
        { name: 'Porcelain White', quantity: 12 },
        { name: 'Bay Blue', quantity: 8 },
      ];
    }
    // 6. Tablets / iPads
    else if (
      lower.includes('pad') ||
      lower.includes('tablet') ||
      (category && category.toLowerCase().includes('tablet'))
    ) {
      warranty = '1 Year Official Manufacturer Warranty';
      matchedImages = DEVICE_IMAGE_PRESETS.tablet;
      description = `${name} features an expansive high-resolution Retina display, pro-level multitasking processing, magnetic stylus pencil support, and quad stereo speakers.`;
      specifications = `• RAM & Storage: 8 GB RAM | 256 GB High-Speed Storage\n• Processor: Apple M2 / Snapdragon Octa-Core Chipset\n• Display: 11 inch Liquid Retina IPS Display (True Tone, 500 nits, ProMotion)\n• Camera: 12MP Wide Rear Camera & 12MP Ultra-Wide Front Camera with Center Stage\n• Battery: Up to 10 Hours Web Surfing & Video Playback\n• Connectivity: Wi-Fi 6E, Bluetooth 5.3, USB-C Port\n• In The Box: Tablet, USB-C Charge Cable, 20W USB-C Power Adapter`;
      colors = [
        { name: 'Space Gray', quantity: 10 },
        { name: 'Silver', quantity: 10 },
      ];
    }
    // 7. Headphones / Earbuds / Audio
    else if (
      lower.includes('headphone') ||
      lower.includes('earbud') ||
      lower.includes('sony') ||
      lower.includes('airpods') ||
      lower.includes('boat') ||
      (category && category.toLowerCase().includes('audio'))
    ) {
      warranty = '1 Year Official Brand Warranty';
      matchedImages = DEVICE_IMAGE_PRESETS.headphones;
      description = `${name} delivers studio-grade acoustics with Industry-Leading Active Noise Cancelation (ANC), speak-to-chat transparency, and up to 30 hours of high-fidelity listening.`;
      specifications = `• Audio Drivers: 30mm Precision Engineered Carbon Fiber Drivers\n• Noise Cancelation: Integrated Processor V1 + HD Noise Canceling Processor QN1 with 8 Microphones\n• Battery Life: 30 Hours with ANC ON (3 min charge gives 3 hours playback)\n• Connectivity: Bluetooth 5.2, LDAC High-Res Audio, Multipoint 2-Device Connection\n• Microphone: 4 Beamforming Mics with AI Noise Reduction\n• In The Box: Headphone, Carrying Case, 3.5mm Audio Cable (1.2m), USB-C Charging Cable`;
      colors = [
        { name: 'Carbon Black', quantity: 15 },
        { name: 'Platinum Silver', quantity: 10 },
      ];
    }
    // 8. Smartwatches
    else if (
      lower.includes('watch') ||
      lower.includes('band') ||
      (category && category.toLowerCase().includes('watch'))
    ) {
      warranty = '1 Year Official Manufacturer Warranty';
      matchedImages = DEVICE_IMAGE_PRESETS.watch;
      description = `${name} offers 24/7 advanced wellness telemetry (ECG, Heart Rate, SpO2, Sleep Stages), precision dual-frequency GPS, and Always-On crystal AMOLED touch display.`;
      specifications = `• Display: 1.43 inch Always-On Sapphire Crystal AMOLED Display (1000 nits)\n• Sensors: Optical Heart Rate, Blood Oxygen (SpO2), ECG, Barometer, Temperature\n• Battery Life: Up to 5 Days in Smart Mode / 14 Days in Power Saver\n• Water Resistance: 50m Water Resistance (5 ATM + IP68)\n• Tracking: 120+ Sports Modes with Automatic Workout Detection\n• In The Box: Smartwatch, Magnetic Fast Charging Dock, Quick Start Guide`;
      colors = [
        { name: 'Black Silicone', quantity: 15 },
        { name: 'Silver Metal', quantity: 10 },
      ];
    }
    // 9. Chargers & Cases
    else if (lower.includes('charger') || lower.includes('cable') || lower.includes('case')) {
      warranty = '6 Months Official Accessories Warranty';
      matchedImages = DEVICE_IMAGE_PRESETS.accessories;
      description = `${name} engineered with premium flame-retardant materials, Gallium Nitride (GaN) fast thermal dissipation, and certified surge protection.`;
      specifications = `• Power Output: 65W / 120W GaN Fast Charging with Power Delivery 3.0 & PPS\n• Ports: Dual USB Type-C + USB Type-A\n• Protection: Over-voltage, Over-current, Short-circuit, and Temperature Control\n• In The Box: Power Adapter, 100W Braided Type-C to Type-C Cable (1.5m), Warranty Card`;
      colors = [
        { name: 'Black', quantity: 25 },
        { name: 'Transparent Clear', quantity: 20 },
      ];
    }

    return {
      description,
      specifications,
      warranty,
      imageUrl: matchedImages[0],
      images: matchedImages,
      colors,
    };
  }
}
