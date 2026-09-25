-- ==============================================================================
-- DEVELOPMENT SEED DATA FOR AVYZEN IMPORTS
-- ==============================================================================

-- 1. CATEGORIES
INSERT INTO public.categories (id, name, slug, description, image, is_active)
VALUES
('c1000000-0000-0000-0000-000000000001', 'Audio & Sound', 'audio', 'High fidelity headphones, earbuds, and premium sound systems.', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop', true),
('c1000000-0000-0000-0000-000000000002', 'Electronics', 'electronics', 'Cutting-edge consumer gadgets, GaN chargers, and power hubs.', 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=800&auto=format&fit=crop', true),
('c1000000-0000-0000-0000-000000000003', 'Smart Gadgets', 'smart-gadgets', 'Productivity gear, smart workspace setups, and wearable tech.', 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=800&auto=format&fit=crop', true),
('c1000000-0000-0000-0000-000000000004', 'Lifestyle & Luxury', 'lifestyle', 'Precision chronograph watches, leather accessories, and luxury EDC.', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop', true)
ON CONFLICT (id) DO NOTHING;

-- 2. PRODUCTS
INSERT INTO public.products (id, category_id, name, slug, sku, description, price, compare_at_price, stock, is_active, is_featured, is_best_seller, is_new_arrival)
VALUES
(
  'p1000000-0000-0000-0000-000000000001',
  'c1000000-0000-0000-0000-000000000001',
  'Avyzen Apex Pro Wireless ANC Headphones',
  'avyzen-apex-pro-wireless-anc-headphones',
  'AV-APEX-01',
  'Engineered for acoustic purists. Features dual 40mm beryllium drivers, active hybrid noise cancellation up to 45dB, 50-hour battery life, and ultra-plush memory foam earcups.',
  8499.00,
  10500.00,
  45,
  true,
  true,
  true,
  false
),
(
  'p1000000-0000-0000-0000-000000000002',
  'c1000000-0000-0000-0000-000000000002',
  'Avyzen Nova 65W GaN III Fast Charger',
  'avyzen-nova-65w-gan-iii-fast-charger',
  'AV-NOVA-65',
  'Ultra-compact Gallium Nitride (GaN III) high-speed charging brick. Dual USB-C and single USB-A ports supporting PD 3.0, QC 4+, and PPS for laptops, phones, and tablets.',
  2450.00,
  3200.00,
  80,
  true,
  true,
  false,
  true
),
(
  'p1000000-0000-0000-0000-000000000003',
  'c1000000-0000-0000-0000-000000000003',
  'Avyzen K75 Pro Hot-Swap Mechanical Keyboard',
  'avyzen-k75-pro-hot-swap-mechanical-keyboard',
  'AV-K75-RGB',
  '75% compact layout with CNC aerospace aluminum chassis, gasket mount design, pre-lubed linear switches, tri-mode wireless connectivity, and customizable South-facing RGB.',
  6890.00,
  8200.00,
  30,
  true,
  true,
  true,
  false
),
(
  'p1000000-0000-0000-0000-000000000004',
  'c1000000-0000-0000-0000-000000000004',
  'Avyzen Chrono Royal Sapphire Leather Watch',
  'avyzen-chrono-royal-sapphire-leather-watch',
  'AV-CHRONO-01',
  'Handcrafted elegance with Japanese Miyota quartz movement, scratch-resistant sapphire crystal glass, 5ATM water resistance, and genuine Italian full-grain leather strap.',
  5990.00,
  7500.00,
  25,
  true,
  false,
  true,
  false
),
(
  'p1000000-0000-0000-0000-000000000005',
  'c1000000-0000-0000-0000-000000000003',
  'Avyzen ErgoStand Pro 360 Rotating Laptop Stand',
  'avyzen-ergostand-pro-360-laptop-stand',
  'AV-ERGO-360',
  'Precision engineered sandblasted aluminum stand with a silent 360-degree rotating base, dual-hinge elevation up to 30cm, and silicone non-slip heat dissipation pads.',
  2850.00,
  3500.00,
  55,
  true,
  false,
  false,
  true
),
(
  'p1000000-0000-0000-0000-000000000006',
  'c1000000-0000-0000-0000-000000000002',
  'Avyzen MagPower Slim 10,000mAh Magnetic Power Bank',
  'avyzen-magpower-slim-10000mah',
  'AV-MAG-10K',
  'Snap and charge on the go with strong 15W wireless MagSafe alignment, 20W PD Type-C fast bi-directional charging, and a discreet fold-out kickstand.',
  3190.00,
  3990.00,
  60,
  true,
  true,
  false,
  true
)
ON CONFLICT (id) DO NOTHING;

-- 3. PRODUCT IMAGES
INSERT INTO public.product_images (id, product_id, image_url, alt_text, sort_order)
VALUES
('i1000000-0000-0000-0000-000000000001', 'p1000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop', 'Avyzen Apex Pro Midnight Black', 0),
('i1000000-0000-0000-0000-000000000002', 'p1000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1484704849700-f032a568e944?q=80&w=800&auto=format&fit=crop', 'Avyzen Apex Pro Folded Angle', 1),
('i1000000-0000-0000-0000-000000000003', 'p1000000-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?q=80&w=800&auto=format&fit=crop', 'Avyzen Nova 65W GaN Charger Front View', 0),
('i1000000-0000-0000-0000-000000000004', 'p1000000-0000-0000-0000-000000000003', 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=800&auto=format&fit=crop', 'Avyzen K75 Mechanical Keyboard Top View', 0),
('i1000000-0000-0000-0000-000000000005', 'p1000000-0000-0000-0000-000000000004', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop', 'Avyzen Chrono Royal Watch Front View', 0),
('i1000000-0000-0000-0000-000000000006', 'p1000000-0000-0000-0000-000000000005', 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=800&auto=format&fit=crop', 'Avyzen ErgoStand Pro Laptop Stand Side Angle', 0),
('i1000000-0000-0000-0000-000000000007', 'p1000000-0000-0000-0000-000000000006', 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?q=80&w=800&auto=format&fit=crop', 'Avyzen MagPower Wireless Power Bank', 0)
ON CONFLICT (id) DO NOTHING;

-- 4. PRODUCT VARIANTS
INSERT INTO public.product_variants (id, product_id, name, sku, price, stock, options, image_url)
VALUES
('v1000000-0000-0000-0000-000000000001', 'p1000000-0000-0000-0000-000000000001', 'Matte Obsidian Black', 'AV-APEX-BLK', 8499.00, 25, '{"Color": "Matte Obsidian Black"}', NULL),
('v1000000-0000-0000-0000-000000000002', 'p1000000-0000-0000-0000-000000000001', 'Silver Frost White', 'AV-APEX-SLV', 8499.00, 20, '{"Color": "Silver Frost White"}', NULL),
('v1000000-0000-0000-0000-000000000003', 'p1000000-0000-0000-0000-000000000003', 'Cream White / Red Switches', 'AV-K75-RED', 6890.00, 15, '{"Color": "Cream White", "Switch": "Red Linear"}', NULL),
('v1000000-0000-0000-0000-000000000004', 'p1000000-0000-0000-0000-000000000003', 'Smoky Gray / Brown Switches', 'AV-K75-BRN', 6890.00, 15, '{"Color": "Smoky Gray", "Switch": "Brown Tactile"}', NULL),
('v1000000-0000-0000-0000-000000000005', 'p1000000-0000-0000-0000-000000000004', 'Cognac Tan Brown Leather', 'AV-CHRONO-BRN', 5990.00, 15, '{"Strap": "Cognac Tan Leather"}', NULL),
('v1000000-0000-0000-0000-000000000006', 'p1000000-0000-0000-0000-000000000004', 'Classic Midnight Black Leather', 'AV-CHRONO-BLK', 5990.00, 10, '{"Strap": "Midnight Black Leather"}', NULL)
ON CONFLICT (id) DO NOTHING;

-- 5. COUPONS
INSERT INTO public.coupons (id, code, type, value, minimum_order, max_discount, usage_limit, used_count, starts_at, expires_at, is_active)
VALUES
('cp100000-0000-0000-0000-000000000001', 'AVYZEN10', 'PERCENTAGE', 10.00, 2000.00, 1000.00, 500, 12, now(), now() + interval '90 days', true),
('cp100000-0000-0000-0000-000000000002', 'WELCOME200', 'FIXED', 200.00, 1500.00, 200.00, 1000, 48, now(), now() + interval '90 days', true)
ON CONFLICT (id) DO NOTHING;

-- 6. REVIEWS
INSERT INTO public.reviews (id, product_id, customer_name, rating, review, status)
VALUES
('r1000000-0000-0000-0000-000000000001', 'p1000000-0000-0000-0000-000000000001', 'Tanvir Ahmed', 5, 'Exceptional sound separation and active noise cancellation. Received original package in Dhaka in under 24 hours. Avyzen is genuine!', 'APPROVED'),
('r1000000-0000-0000-0000-000000000002', 'p1000000-0000-0000-0000-000000000001', 'Sajid Hasan', 5, 'The build quality is stunning. Memory foam cushions are comfortable for 8+ hour work sessions.', 'APPROVED'),
('r1000000-0000-0000-0000-000000000003', 'p1000000-0000-0000-0000-000000000003', 'Mahmudul Karim', 5, 'Gasket mount typing experience is creamy and deep. RGB lighting looks premium on dark desk.', 'APPROVED')
ON CONFLICT (id) DO NOTHING;
