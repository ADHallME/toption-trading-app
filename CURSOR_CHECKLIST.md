# 🤖 CURSOR EXECUTION CHECKLIST - Phase 1 Cleanup

**Date:** October 17, 2025  
**Task:** Delete 9 duplicate files and prepare for Phase 1B  
**Auditor:** Claude (after Cursor completes)

---

## 📋 TASKS FOR CURSOR

### Task 1: Delete Duplicate Files (9 total)

**Polygon Clients (5 files):**
```bash
rm src/lib/polygon/api-client.ts
rm src/lib/polygon/market-client.ts
rm src/lib/polygon/unified-client.ts
rm src/lib/polygon/client.ts
rm src/lib/polygon/enhanced-client.ts
```

**Scanners (3 files):**
```bash
rm src/lib/scanner/market-scanner.ts
rm src/lib/scanner/market-scanner-fixed.ts
rm src/lib/scanner/market-scanner-simple.ts
```

**Dashboard Components (1 file):**
```bash
rm src/components/dashboard/EnhancedOverviewV2.tsx
```

### Task 2: Test Build
```bash
npm run build
```

### Task 3: Commit Changes
```bash
git add .
git commit -m "chore: remove 9 duplicate files"
```

---

## ✅ SUCCESS CRITERIA

- [ ] All 9 files deleted
- [ ] Build passes
- [ ] Commit created

---

## 🔍 CLAUDE AUDIT CHECKLIST

After Cursor finishes:
- [ ] Verify 9 files gone
- [ ] Verify active files still present
- [ ] Review build output
- [ ] Check git commit
- [ ] Ready for Phase 1B

---

**Status:** Ready for Cursor
