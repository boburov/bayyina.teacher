# Bayyina — O'qituvchi Paneli

> Ta'lim markazi uchun zamonaviy CRM tizimi. O'qituvchilar guruhlarini boshqarishi, o'quvchilar ro'yxatini ko'rishi va har kunlik davomatni belgilashi mumkin.

---

## Mundarija

- [Loyiha haqida](#loyiha-haqida)
- [Texnologiyalar](#texnologiyalar)
- [Arxitektura](#arxitektura)
- [Papkalar tuzilmasi](#papkalar-tuzilmasi)
- [O'rnatish va ishga tushirish](#ornatish-va-ishga-tushirish)
- [Kirish ma'lumotlari](#kirish-malumotlari)
- [Sahifalar va funksiyalar](#sahifalar-va-funksiyalar)
- [Komponentlar](#komponentlar)
- [Ma'lumotlar tuzilmasi](#malumotlar-tuzilmasi)
- [Dizayn tizimi](#dizayn-tizimi)

---

## Loyiha haqida

**Bayyina Teacher Panel** — "Bayyina" ta'lim markazi uchun maxsus ishlab chiqilgan o'qituvchi paneli. Tizim orqali o'qituvchi:

- O'ziga biriktirilgan **guruhlarni** ko'radi
- Har bir guruh bo'yicha **o'quvchilar ro'yxatini** kuzatadi
- Har kuni **davomat** belgilaydi — oxirgi 20 kunlik jadval ko'rinishida
- Belgilangan davomatni **saqlaydi** va o'zgartirishlar kiritadi

---

## Texnologiyalar

| Texnologiya | Versiya | Maqsad |
|-------------|---------|--------|
| React | 19 | UI freymvork |
| TypeScript | 6 | Tip xavfsizligi |
| Vite | 8 | Build vosita |
| Tailwind CSS | 3 | Stillar |
| React Router | 7 | Sahifalar orasida navigatsiya |
| TanStack Query | 5 | Server holati boshqaruvi |
| Lucide React | latest | Ikonlar |

---

## Arxitektura

Loyiha **Feature-Sliced Design (FSD)** arxitekturasiga asoslangan. FSD — katta React ilovalar uchun standart, qatlamli arxitektura yondashuvi.

### Qatlamlar (yuqoridan pastga import qilish tartibi)

```
app        ← Ilovani yig'ish: provayderlar, router
pages      ← To'liq sahifalar
widgets    ← Sahifaning yirik bo'limlari (Sidebar, Layout)
features   ← Foydalanuvchi amallari (login, davomat olish)
entities   ← Biznes ob'ektlar (guruh, o'quvchi, davomat)
shared     ← Umumiy vositalar (UI, lib, config, API)
```

> **Qoida:** Har bir qatlam faqat o'zidan **pastki** qatlamlardan import qila oladi.

---

## Papkalar tuzilmasi

```
src/
├── app/
│   ├── providers/
│   │   ├── AuthProvider.tsx       # Autentifikatsiya holati (localStorage)
│   │   ├── ToastProvider — shared/lib/toast.tsx orqali
│   │   └── index.tsx              # Barcha provayderlarni birlashtirish
│   └── router/
│       └── index.tsx              # Barcha yo'nalishlar (routes)
│
├── pages/
│   ├── login/
│   │   └── ui/LoginPage.tsx       # Kirish sahifasi
│   ├── groups/
│   │   └── ui/GroupsPage.tsx      # Guruhlar ro'yxati
│   ├── group-details/
│   │   └── ui/GroupDetailsPage.tsx # Guruh tafsilotlari + o'quvchilar
│   └── attendance/
│       └── ui/AttendancePage.tsx   # Davomat sahifasi (jadval)
│
├── widgets/
│   ├── sidebar/
│   │   └── ui/Sidebar.tsx         # Yon panel (desktop + mobil drawer)
│   ├── header/
│   │   └── ui/Header.tsx          # Sahifa sarlavhasi, orqaga tugma
│   └── dashboard-layout/
│       └── ui/DashboardLayout.tsx  # Asosiy layout + autentifikatsiya himoyasi
│
├── features/
│   ├── auth/login/
│   │   ├── model/useLogin.ts      # Kirish formasi holati va logikasi
│   │   └── ui/LoginForm.tsx       # Email + parol formasi
│   └── attendance/
│       ├── attendance-table/
│       │   ├── model/useAttendanceTable.ts  # Davomat holati va submit
│       │   ├── ui/AttendanceTable.tsx       # 20 kunlik jadval komponenti
│       │   └── ui/AttendanceCell.tsx        # Bitta katak (keldi/kelmadi)
│       └── take-attendance/
│           ├── model/useAttendance.ts       # Oddiy davomat formasi logikasi
│           └── ui/AttendanceForm.tsx        # Toggle ro'yxat formasi
│
├── entities/
│   ├── user/model/
│   │   ├── types.ts               # User, AuthState interfeyslari
│   │   └── auth-store.ts          # localStorage yordamchilari
│   ├── group/model/
│   │   ├── types.ts               # Group, Student, GroupSchedule
│   │   └── api.ts                 # fetchGroups, fetchGroupById
│   ├── student/model/
│   │   └── types.ts               # Student (re-export)
│   └── attendance/model/
│       ├── types.ts               # AttendanceRecord, AttendanceHistory
│       └── api.ts                 # fetchGroupAttendanceHistory, submitAttendance
│
└── shared/
    ├── api/
    │   └── mock-data.ts           # Mock ma'lumotlar (3 guruh, 28 o'quvchi)
    ├── config/
    │   └── routes.ts              # ROUTES konstantalari
    ├── lib/
    │   ├── cn.ts                  # classnames yordamchi funksiyasi
    │   ├── dates.ts               # Sana formatlash va hisoblash
    │   └── toast.tsx              # Toast tizimi (context + hook + UI)
    └── ui/
        ├── Button/                # Tugma (4 variant, 3 o'lcham, loading holati)
        ├── Input/                 # Matn kiritish (label, xato, ikonka)
        ├── Card/                  # Karta va CardHeader
        ├── Badge/                 # Nishon (5 rang varianti)
        ├── Checkbox/              # Belgilash qutisi
        ├── Skeleton/              # Yuklanish skeletoni
        ├── Spinner/               # Aylana yuklanish indikatori
        └── EmptyState/            # Bo'sh holat komponenti
```

---

## O'rnatish va ishga tushirish

### Talablar

- Node.js 18 yoki undan yuqori
- npm yoki yarn

### 1. Bog'liqliklarni o'rnatish

```bash
npm install
```

### 2. Ishlab chiqish rejimida ishga tushirish

```bash
npm run dev
```

Brauzerda oching: [http://localhost:5173](http://localhost:5173)

### 3. Production build yaratish

```bash
npm run build
```

### 4. Build natijasini ko'rish

```bash
npm run preview
```

---

## Kirish ma'lumotlari

Demo tizimga kirish uchun:

| Maydon | Qiymat |
|--------|--------|
| Email | `aziz@bayyina.uz` yoki `aziz` |
| Parol | Istalgan 3 va undan ko'p belgi |

> Tizim `localStorage`ga ma'lumot saqlaydi — sahifani yangilagandan keyin ham sessiya saqlanib qoladi.

---

## Sahifalar va funksiyalar

### Kirish sahifasi `/login`

- Email va parol bilan kirish
- Maydonlar tekshiruvi (validation)
- Parolni ko'rsatish/yashirish tugmasi
- Muvaffaqiyatli kirishdan so'ng avtomatik yo'naltirish

### Guruhlar sahifasi `/groups`

- O'qituvchiga biriktirilgan guruhlar kartalar ko'rinishida
- Har bir kartada: guruh nomi, o'quvchilar soni, dars kunlari va vaqti
- Kartani bosish → guruh tafsilotlari sahifasiga o'tish
- Yuklanish skeleti va bo'sh holat

### Guruh tafsilotlari `/groups/:id`

- Guruh statistikasi (o'quvchilar soni, dars kunlari, vaqti)
- O'quvchilar jadvali: ism, telefon raqami, holat
- **"Davomatga o'tish"** tugmasi → davomat sahifasiga to'g'ridan-to'g'ri o'tish

### Davomat sahifasi `/attendance`

- **1-qadam:** Guruh tanlash (kartalar ro'yxati)
- **2-qadam:** 20 kunlik davomat jadvali

#### Davomat jadvali xususiyatlari

| Xususiyat | Tavsif |
|-----------|--------|
| Satrlar | O'quvchilar |
| Ustunlar | Oxirgi 20 kun |
| Bugungi ustun | Sariq rang bilan ajratilgan, **tahrirlash mumkin** |
| O'tgan kunlar | Kulrang, o'chirilgan (faqat ko'rish) |
| Keldi belgisi | Yashil ✅ |
| Kelmadi belgisi | Qizil ❌ |
| Birinchi ustun | O'ng tomonga siljitganda ham o'quvchi ismi ko'rinib turadi (sticky) |
| Ommaviy belgilash | "Barchasi keldi" / "Barchasi kelmadi" tugmalari |
| Saqlash | "Bugungi davomatni saqlash" — muvaffaqiyatda toast xabar |

---

## Komponentlar

### Shared UI komponentlar

#### `Button`
```tsx
<Button variant="primary" size="md" loading={false}>
  Saqlash
</Button>
```

| Prop | Qiymatlar | Standart |
|------|-----------|---------|
| `variant` | `primary` `secondary` `ghost` `danger` | `primary` |
| `size` | `sm` `md` `lg` | `md` |
| `loading` | `boolean` | `false` |
| `fullWidth` | `boolean` | `false` |

#### `Input`
```tsx
<Input
  label="Email"
  type="email"
  error="Majburiy maydon"
  leftIcon={<Mail size={16} />}
/>
```

#### `Card`
```tsx
<Card hover padding="md">
  <CardHeader title="Sarlavha" subtitle="Izoh" action={<Button>...</Button>} />
  ...
</Card>
```

#### `Badge`
```tsx
<Badge variant="success">Keldi</Badge>
<Badge variant="danger">Kelmadi</Badge>
```

Variantlar: `default` `success` `warning` `danger` `info`

#### `useToast` hook
```tsx
const toast = useToast()

toast.success("Muvaffaqiyatli saqlandi!")
toast.error("Xatolik yuz berdi!")
toast.info("Ma'lumot yangilandi")
```

---

## Ma'lumotlar tuzilmasi

### `Group`
```typescript
interface Group {
  id:           string
  name:         string
  studentCount: number
  schedule: {
    days: string[]   // ['Dushanba', 'Chorshanba', 'Juma']
    time: string     // '09:00–10:30'
  }
  students: Student[]
}
```

### `Student`
```typescript
interface Student {
  id:    string
  name:  string
  phone: string | null
}
```

### `AttendanceRecord`
```typescript
interface AttendanceRecord {
  id:      string
  groupId: string
  date:    string            // 'YYYY-MM-DD'
  entries: AttendanceEntry[]
}

interface AttendanceEntry {
  studentId: string
  status:    'present' | 'absent'
}
```

### `AttendanceHistory`
```typescript
interface AttendanceHistory {
  dates:   string[]   // Oxirgi 20 kunning sanalari
  records: Record<string, Record<string, 'present' | 'absent' | null>>
  //       studentId  ->  date  ->  holat (null = hali belgilanmagan)
}
```

---

## Dizayn tizimi

### Ranglar

| Nom | Qiymat | Ishlatilish |
|-----|--------|------------|
| `brown-800` | `#65443c` | Asosiy rang (tugmalar, aktiv menyu) |
| `brown-900` | `#271816` | Sarlavhalar |
| `brown-400` | `#d2bab0` | Ikkinchi darajali matn |
| `brown-100` | `#f2e8e5` | Chegara, fon |
| `cream` | `#faf7f5` | Sahifa foni |
| `amber-*` | — | Bugungi ustun ajratish |
| `emerald-500` | — | "Keldi" belgisi |
| `rose-400` | — | "Kelmadi" belgisi |

### Soyalar

```
shadow-soft       — yengilroq soya (kartalar chegarasi)
shadow-card       — o'rta soya (karta)
shadow-card-hover — kuchli soya (hover holat)
```

### Burchaklar

```
rounded-xl   — tugmalar, inputlar, kichik elementlar
rounded-2xl  — kartalar, jadval
rounded-3xl  — kirish sahifasi kartasi
```

### Shrift

**Inter** (Google Fonts) — 300, 400, 500, 600, 700 og'irliklar.

---

## Skriptlar

```bash
npm run dev      # Ishlab chiqish serveri
npm run build    # Production build (dist/ papkasiga)
npm run preview  # dist/ papkasini lokal ko'rish
npm run lint     # ESLint tekshiruvi
```

---

## Litsenziya

Ushbu loyiha **Bayyina Ta'lim Markazi** uchun maxsus ishlab chiqilgan.  
© 2026 Bayyina. Barcha huquqlar himoyalangan.
