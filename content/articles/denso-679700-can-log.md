---
title: DENSO 679700系ECUのCANログ取得
car: スカイラインGT-R (BNR34)
ecu: DENSO 679700
purpose: 走行中のCAN IDマッピングとログ取得手順の記録
note_url: https://example.com/notes/denso-679700-can-log
related:
  - rb26-ecu-pinout
date: 2026-08-01
---

DENSO 679700系ECUに対して、CANバスからIDを収集した際の手順とメモ。

## やったこと

- OBD-IIポートからCH1/CH2を分岐
- ロガーでCAN IDを収集し、既知IDと突き合わせ

## わかったこと

- 主要な回転数/水温IDは 0x XXX 台に集中
- 詳細は note_url を参照
