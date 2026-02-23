---
title: "블록체인 기반 메타버스 IoT 통신 플랫폼 (with DID & MQTT)"
description: "가상환경-실제 디바이스 간 데이터 무결성 보장 및 실시간 최적화"
weight: 3
translationKey: "project-3"
---


## 개요

본 프로젝트는 메타버스 환경과 실제 IoT 기기 간의 안전하고 효율적인 데이터 통신을 위한 분산형 플랫폼을 목표로 합니다. DID(Decentralized Identifier)를 활용한 신원 검증과 MQTT 프로토콜을 통한 실시간 데이터 전송을 결합하여, 데이터의 무결성을 보장하면서도 낮은 지연 시간으로 상호작용을 구현했습니다. 또한 탈중앙 신원 관리를 위해 Hyperledger Indy 기반의 DID 원장을 활용하여 참여 주체의 신뢰 가능한 식별과 검증 가능한 자격 증명 관리를 구현했습니다.


## 주요 기능


### 1. 분산 신원 관리 (Hyperledger Indy 기반 DID & Verifiable Credentials)
기존 중앙 서버 방식의 ID 관리에서 벗어나, Hyperledger Indy를 활용한 DID 시스템을 구축하여 사용자가 자신의 신원을 직접 소유하고 통제할 수 있도록 했습니다. 이를 통해 메타버스 내 아바타와 실제 IoT 기기의 소유권을 안전하게 증명하고, 상호작용 시 프라이버시를 보호하며, 검증 가능한 자격 증명(VC)을 통해 신뢰할 수 있는 상호작용을 보장합니다.


### 2. 실시간 IoT 데이터 스트리밍 (MQTT)
경량 메시징 프로토콜인 MQTT를 도입하여, 저사양 IoT 기기에서도 실시간으로 센서 데이터를 수집하고 메타버스 환경으로 전송합니다. 브로커 기반의 비동기 통신 구조로 대규모 디바이스 연결 환경에서도 안정적인 데이터 흐름을 유지합니다.


### 3. 메타버스 통합 인터페이스
Unity 엔진을 기반으로 개발된 메타버스 환경에서 사용자는 자신의 아바타를 통해 실제 IoT 기기와 시각적으로 상호작용할 수 있습니다. 데이터의 흐름을 시각화하고, 기기 상태를 실시간으로 모니터링할 수 있는 직관적인 UI/UX를 제공합니다.


## 기술 스택

* **Blockchain / DID Ledger**: Hyperledger Indy (탈중앙 신원 관리 및 DID/VC 발급·검증)
* **IoT Communication**: MQTT (Mosquitto Broker)
* **Metaverse Engine**: Unity 3D
* **Backend**: Node.js, Express.js
* **Frontend**: React.js
* **Database**: MongoDB


## 기대 효과

본 프로젝트는 메타버스와 현실 세계의 경계를 허무는 새로운 차원의 사용자 경험을 제공합니다. Hyperledger Indy 기반 DID 신원 관리로 보안과 프라이버시를 강화하고, MQTT를 통한 실시간 데이터 통신으로 몰입감 있는 상호작용을 구현했습니다. 이는 향후 스마트 홈, 산업 자동화, 원격 제어 등 다양한 분야에서 확장 가능한 기반 기술이 될 것입니다.
