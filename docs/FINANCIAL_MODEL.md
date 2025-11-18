# TRU Talk - Financial Model
## Path to $100M ARR & Unicorn Valuation

---

## 📊 Executive Summary

**Target Metrics (18 Months)**:
- 10M Monthly Active Users (MAU)
- $100M Annual Recurring Revenue (ARR)
- $1B+ Valuation (Unicorn Status)
- 30% Month-over-Month Retention
- LTV/CAC Ratio: 11.5×

---

## 🚀 User Growth Model

### Formula: Viral Coefficient + Paid Acquisition

```javascript
// Month-over-month user growth
MAU[month] = MAU[month-1] * (1 + organicGrowthRate + paidGrowthRate)

// Organic growth (viral loops)
organicGrowthRate = viralCoefficient * sharingRate * conversionRate

// Paid growth
paidGrowthRate = marketingSpend / CAC / MAU[month-1]

// Retention impact
activeMAU = MAU * retentionRate
```

### 18-Month Projection

| Month | MAU | Marketing Spend | CAC | New Users | Retention | Active MAU |
|-------|-----|-----------------|-----|-----------|-----------|------------|
| M1 | 1,000 | $5,000 | $5.00 | 1,000 | 70% | 700 |
| M3 | 10,000 | $25,000 | $4.80 | 9,000 | 75% | 7,500 |
| M6 | 100,000 | $150,000 | $4.50 | 90,000 | 80% | 80,000 |
| M9 | 500,000 | $500,000 | $4.50 | 400,000 | 82% | 410,000 |
| M12 | 2,000,000 | $1,500,000 | $4.50 | 1,500,000 | 85% | 1,700,000 |
| M15 | 5,000,000 | $3,000,000 | $4.50 | 3,000,000 | 88% | 4,400,000 |
| M18 | **10,000,000** | $5,000,000 | $4.50 | 5,000,000 | **90%** | **9,000,000** |

### Growth Drivers

1. **Viral Loops** (Organic: 40% of growth)
   - Shareable Echos to social media
   - Referral bonuses (50 Echo Chips)
   - "1M calls this week" social proof

2. **Paid Acquisition** (60% of growth)
   - Influencer partnerships: $3.00 CAC
   - TikTok/Instagram ads: $1.50 CAC
   - College campus ambassadors

3. **Retention Mechanics**
   - Daily streaks (10-day avg increases to 30-day)
   - Echo collectibles (NFT incentives)
   - Community forums (stickiness)

---

## 💰 Revenue Model

### Revenue Per User (ARPU)

```javascript
// Monthly ARPU calculation
ARPU = (echoChipsRevenue + premiumRevenue + vipRevenue + nftRevenue) / MAU

// Echo Chips (one-time purchases)
echoChipsRevenue = MAU * 0.20 * $0.99 * 2 purchases/month = $0.40

// Premium subscriptions
premiumRevenue = MAU * 0.05 * $9.99 = $0.50

// VIP subscriptions
vipRevenue = MAU * 0.01 * $19.99 = $0.20

// NFT sales
nftRevenue = MAU * 0.01 * $10 = $0.10

// Total monthly ARPU
ARPU = $0.40 + $0.50 + $0.20 + $0.10 = $1.20/month
```

### 18-Month Revenue Projection

| Month | MAU | ARPU | MRR | ARR |
|-------|-----|------|-----|-----|
| M1 | 1K | $1.00 | $1K | $12K |
| M3 | 10K | $1.05 | $10.5K | $126K |
| M6 | 100K | $1.10 | $110K | $1.3M |
| M9 | 500K | $1.15 | $575K | $6.9M |
| M12 | 2M | $1.20 | $2.4M | $28.8M |
| M15 | 5M | $1.25 | $6.25M | $75M |
| M18 | **10M** | **$1.30** | **$13M** | **$156M** |

**Note**: Conservative model at $1.30 ARPU. Best-case scenario with mature monetization = $5.20 ARPU → **$624M ARR**

### Revenue Breakdown (Month 18)

| Stream | Users | Conversion | Revenue/User | Total Monthly |
|--------|-------|------------|--------------|---------------|
| Echo Chips | 10M | 20% | $1.98 | $3.96M |
| Premium | 10M | 5% | $9.99 | $4.995M |
| VIP | 10M | 1% | $19.99 | $1.999M |
| NFTs | 10M | 1% | $10 | $1M |
| **Total** | - | - | - | **$11.95M MRR** |

**Annual Run-Rate**: $143M → **$156M ARR** (with growth)

---

## 💵 Cost Structure

### Variable Costs (Per User)

```javascript
// Monthly cost per active user
costPerUser = aiCosts + infrastructureCosts + paymentProcessing

// AI API costs (transcription, translation, TTS)
aiCosts = (
  $0.006 per transcription * 10 clips/month +
  $0.002 per translation * 5 calls/month +
  $0.004 per TTS * 5 calls/month
) = $0.08

// Infrastructure (Supabase, Vercel, Daily.co)
infrastructureCosts = $0.015

// Payment processing (Stripe 2.9% + $0.30)
paymentProcessing = ARPU * 0.029 = $0.04

// Total variable cost
costPerUser = $0.08 + $0.015 + $0.04 = $0.135/month
```

### Fixed Costs (Monthly)

| Category | M1-M6 | M6-M12 | M12-M18 |
|----------|-------|--------|---------|
| Salaries (10-30 people) | $150K | $300K | $500K |
| Office & Operations | $20K | $40K | $60K |
| Legal & Compliance | $10K | $20K | $30K |
| Marketing (fixed) | $50K | $100K | $200K |
| **Total Fixed** | **$230K** | **$460K** | **$790K** |

### Gross Margin Analysis

```javascript
// Month 18 (10M MAU, $13M MRR)
revenue = $13,000,000
variableCosts = 10,000,000 * $0.135 = $1,350,000
fixedCosts = $790,000

grossMargin = (revenue - variableCosts) / revenue = 89.6%
netMargin = (revenue - variableCosts - fixedCosts) / revenue = 83.5%

// EBITDA
EBITDA = $13M - $1.35M - $0.79M = $10.86M/month
annualEBITDA = $130M
EBITDAmargin = 83.5%
```

**Conclusion**: **World-class margins** (software business = 70-80%, we're at 83%+)

---

## 📈 LTV & CAC Analysis

### Lifetime Value (LTV)

```javascript
// Average customer lifespan
avgLifetimeMonths = 18 // Assumption based on retention curves

// Monthly revenue per user
monthlyARPU = $1.30 // Conservative (mature = $5.20)

// Gross margin
grossMargin = 0.896

// LTV Formula
LTV = monthlyARPU * avgLifetimeMonths * grossMargin
LTV = $1.30 * 18 * 0.896 = $20.97 ≈ $21

// Best-case (mature ARPU)
LTV_bestCase = $5.20 * 18 * 0.896 = $83.91 ≈ $84
```

### Customer Acquisition Cost (CAC)

```javascript
// Blended CAC (organic + paid)
organicCAC = $0 // Viral referrals are free
paidCAC = $4.50 // Influencer + ads

// Weighted average (40% organic, 60% paid)
blendedCAC = 0.4 * $0 + 0.6 * $4.50 = $2.70

// Conservative (all paid)
conservativeCAC = $4.50
```

### LTV/CAC Ratios

| Scenario | LTV | CAC | Ratio | Status |
|----------|-----|-----|-------|--------|
| Conservative | $21 | $4.50 | **4.7×** | ✅ Healthy (>3×) |
| Blended | $21 | $2.70 | **7.8×** | ✅ Excellent (>5×) |
| Best-Case | $84 | $4.50 | **18.7×** | 🚀 Unicorn-tier |

**Benchmark**:
- Good: 3×
- Great: 5×
- Exceptional: 7×+
- **TRU Talk: 4.7-18.7×** 🏆

---

## 💼 Funding & Valuation

### Capital Raised

| Round | Date | Amount | Valuation | Dilution |
|-------|------|--------|-----------|----------|
| Seed | Q1 2026 | $2M | $10M pre | 20% |
| Series A | Q2 2026 | $15M | $60M pre | 25% |
| Series B | Q3 2027 | $50M | $250M pre | 20% |
| Series C | Q2 2028 | $100M | $1B pre | 10% |
| **Total** | - | **$167M** | - | **57%** |

### Valuation Multiples

```javascript
// ARR multiple (SaaS standard = 10-20×)
// High-growth consumer social = 15-30×

// Month 18: $156M ARR
valuationConservative = $156M * 15 = $2.34B
valuationAggressive = $156M * 25 = $3.9B

// MAU multiple (social apps = $50-$200 per user)
// 10M MAU
valuationPerUser = 10M * $100 = $1B (base case)
valuationPerUser = 10M * $200 = $2B (bull case)
```

### Unicorn Path

**Requirement**: $1B+ valuation

**Achievement Date**: Month 18 (Q2 2028)
- 10M MAU × $100/user = $1B ✅
- $156M ARR × 15 multiple = $2.34B ✅

**IPO Readiness (2029-2030)**:
- 50M MAU
- $300M+ ARR
- Profitability (15% EBITDA margin)
- SOC2, GDPR compliant
- Target valuation: $3-5B

---

## 🎯 Key Performance Indicators (KPIs)

### North Star Metric

**Completed Calls Per Week**
- Drives: Engagement, retention, revenue
- Target: 50M calls/week (10M MAU × 5 calls/week)

### Product KPIs

| Metric | Current | M6 | M12 | M18 | Industry Avg |
|--------|---------|----|----|-----|--------------|
| MAU | 1K | 100K | 2M | 10M | - |
| DAU/MAU | 40% | 45% | 50% | 55% | 20-30% |
| Calls/Week per User | 3 | 4 | 5 | 6 | 0.1 (Tinder) |
| Call Completion Rate | 52% | 53% | 55% | 58% | 2-8% |
| Avg Call Duration | 4 min | 5 min | 6 min | 7 min | - |
| MoM Retention | 70% | 80% | 85% | 90% | 20-40% |
| NPS Score | 72 | 75 | 78 | 80 | 30-50 |

### Business KPIs

| Metric | M6 | M12 | M18 | Target |
|--------|----|----|-----|--------|
| ARPU | $1.10 | $1.20 | $1.30 | $1.30+ |
| CAC | $4.80 | $4.50 | $4.50 | <$5 |
| LTV | $20 | $21 | $22 | >$50 |
| LTV/CAC | 4.2× | 4.7× | 4.9× | >3× |
| Gross Margin | 87% | 89% | 90% | >80% |
| Monthly Burn | $300K | $500K | $800K | <$1M |
| Months to Profitability | - | M14 | M16 | M18 |

---

## 🔮 Scenario Analysis

### Base Case (50% probability)
- 10M MAU by M18
- $156M ARR
- $1.5B valuation
- Series C: $75M @ $800M

### Bull Case (30% probability)
- 15M MAU by M18 (viral explosion)
- $300M ARR (mature ARPU $1.67)
- $3B valuation
- Series C: $100M @ $1.2B

### Bear Case (20% probability)
- 5M MAU by M18 (slower growth)
- $65M ARR
- $600M valuation
- Series B.5: $30M @ $400M

---

## 📊 Use of Funds (Series A: $15M)

### Allocation

| Category | Amount | % | ROI Justification |
|----------|--------|---|-------------------|
| **Product Dev** | $5M | 33% | |
| - AI/ML engineers (3) | $1.8M | | Improve emotion accuracy to 98% |
| - Backend engineers (2) | $1.2M | | Scale to 100M users |
| - Mobile engineers (2) | $1.2M | | React Native perf optimization |
| - Product manager (1) | $800K | | Feature prioritization |
| **Marketing & Growth** | $6M | 40% | |
| - Influencer partnerships | $2M | | $3 CAC, 650K users |
| - Paid ads (TikTok, IG) | $2.5M | | $1.50 CAC, 1.6M users |
| - College ambassadors | $500K | | Viral campus adoption |
| - Content creation | $1M | | Shareable Echos, viral loops |
| **Team Expansion** | $3M | 20% | |
| - Growth marketer (1) | $600K | | Optimize conversion funnels |
| - Community manager (1) | $400K | | Forums moderation, challenges |
| - Data scientist (1) | $600K | | Predictive matching, A/B tests |
| - Customer support (3) | $900K | | 24/7 coverage, < 2hr response |
| - Operations (1) | $500K | | Vendor management, contracts |
| **Operations & Legal** | $1M | 7% | |
| - SOC2 compliance | $300K | | Enterprise trust, partnerships |
| - Legal (patents, IP) | $400K | | Defensibility, licensing |
| - Office & admin | $300K | | SF HQ, team culture |

**Total**: $15M = 100%

### Expected Outcomes (12 months post-funding)

- **User Growth**: 1K → 2M MAU (2,000× growth)
- **Revenue**: $12K ARR → $28.8M ARR (2,400× growth)
- **Team**: 3 → 30 people
- **Runway**: 18-24 months
- **Series B Readiness**: $28M ARR, 2M MAU, path to $50M+ ARR

---

## 💡 Profitability Path

### Break-Even Analysis

```javascript
// Fixed costs (monthly at M18)
fixedCosts = $790K

// Variable costs (monthly at 10M MAU)
variableCosts = 10M * $0.135 = $1.35M

// Total costs
totalCosts = $790K + $1.35M = $2.14M

// Break-even revenue
breakEvenRevenue = $2.14M

// Break-even MAU
breakEvenMAU = $2.14M / $1.30 ARPU = 1.65M MAU

// Achieved at: Month 12-13
```

### Path to Profitability

| Month | MAU | MRR | Costs | Profit | Margin |
|-------|-----|-----|-------|--------|--------|
| M12 | 2M | $2.4M | $2.27M | $130K | 5% |
| M15 | 5M | $6.25M | $3.47M | $2.78M | 44% |
| M18 | 10M | $13M | $5.14M | $7.86M | 60% |
| M24 | 20M | $31.2M | $9.48M | $21.72M | 70% |

**Profitability Milestone**: Month 12 (ahead of industry avg: 18-24 months)

---

*TRU Talk Financial Model | Last Updated: Q1 2026 | Proprietary & Confidential*
