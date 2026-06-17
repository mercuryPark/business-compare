import { Callout } from '../../components/learn/primitives/Callout';
import { Caveat } from '../../components/learn/primitives/Caveat';
import { CtaLink } from '../../components/learn/primitives/CtaLink';
import { DecisionChecklist } from '../../components/learn/primitives/DecisionChecklist';
import { HiddenCostList } from '../../components/learn/primitives/HiddenCostList';
import { SourceBackedTable } from '../../components/learn/primitives/SourceBackedTable';
import { TermExplainer } from '../../components/learn/primitives/TermExplainer';

const SOURCE_ID = 'ch4-semas-initial-cost';

export function Chapter4() {
  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h2 className="text-xl font-semibold text-ink">창업에 드는 돈 — 초기비용 전체 지도</h2>
        <p className="text-muted">
          창업 비용은 &lsquo;인테리어 얼마, 보증금 얼마&rsquo; 식으로 따로 떠오르지만, 실제로
          통장에서 빠져나갈 때는 한꺼번에 빠져나갑니다. 이 장은 시작할 때 드는 돈을 항목별로 한
          지도에 펼쳐 보고, 사람들이 자주 빠뜨리는 비용과{' '}
          <span className="font-semibold">&lsquo;잘 안 됐을 때 잃는 돈&rsquo;</span>까지 숫자로
          따져봅니다.
        </p>
      </header>

      <Caveat>
        이 장의 금액은 모두 <span className="font-semibold">예시 범위·예시 가정</span>이며, 공식
        통계가 아닙니다. 실제 비용은 입지·업종·면적·브랜드에 따라 몇 배까지 차이가 납니다. 숫자
        자체보다 &lsquo;어떤 항목이 있는지, 무엇을 빠뜨리기 쉬운지&rsquo;를 보는 데 쓰세요.
      </Caveat>

      <section className="space-y-3">
        <h3 className="text-lg font-semibold text-ink">1. 초기비용 전체 지도</h3>
        <p className="text-sm text-ink">
          시작할 때 드는 돈은 크게 여섯 덩어리입니다. 아래 표의 금액은 작은 매장 기준의{' '}
          <span className="font-semibold">예시 범위</span>일 뿐, 내 가게의 견적이 아닙니다. 각
          항목이 &lsquo;나에게도 발생하는지&rsquo;를 먼저 체크하세요.
        </p>
        <SourceBackedTable
          caption="초기비용 항목 지도 (작은 매장 예시 범위 · 실제와 다름)"
          sourceId={SOURCE_ID}
          rows={[
            {
              label: '가맹비·교육비 (프랜차이즈)',
              value: '예시 500만~2,000만 원',
              note: '브랜드별 상이, 정보공개서 확인',
            },
            {
              label: '보증금 (가맹 보증금/임차 보증금)',
              value: '예시 1,000만~5,000만 원',
              note: '나갈 때 돌려받는 돈 / 못 받는 돈 구분',
            },
            {
              label: '인테리어·설비',
              value: '예시 평당 200만~400만 원',
              note: '면적·업종·주방설비에 따라 급변',
            },
            {
              label: '초도물품·집기',
              value: '예시 500만~2,000만 원',
              note: '첫 재고+소도구, 회수 어려움',
            },
            {
              label: '권리금',
              value: '예시 0~수천만 원',
              note: '앞 임차인에게 지급, 회수 보장 없음',
            },
            {
              label: '예비 운전자금 (별도)',
              value: '생활비+운영비 6~12개월치',
              note: '초기비용과 따로 떼어 둘 돈',
            },
          ]}
        />
        <p className="text-sm text-ink">
          여기서 핵심은 마지막 줄입니다.{' '}
          <span className="font-semibold">예비 운전자금은 초기비용에 포함된 돈이 아니라, 그와
          별도로 따로 떼어 두어야 하는 돈</span>입니다(1장 참고). 초기 투자에 가진 돈을 모두
          쓰고 예비자금이 0이면, 첫 고비에서 버티지 못합니다.
        </p>
      </section>

      <section className="space-y-3">
        <h3 className="text-lg font-semibold text-ink">2. 권리금·초도물품 — 헷갈리기 쉬운 두 항목</h3>
        <div className="space-y-3">
          <div className="rounded-xl border border-line bg-surface p-4">
            <h4 className="mb-1 text-sm font-semibold text-forest">권리금</h4>
            <p className="text-sm text-ink">
              <TermExplainer
                term="권리금"
                explanation="기존 임차인에게 자리·시설·단골(영업가치)의 대가로 주는 돈입니다. 임대인이 아니라 앞 임차인에게 주는 돈이라 임대차계약서에는 잘 나타나지 않고, 나갈 때 회수할 수 있다는 보장도 없습니다."
              />
              은 임대인이 아니라 앞 임차인에게 주는 돈입니다. 내가 나갈 때 다음 사람에게서
              돌려받을 수 있을 것 같지만,{' '}
              <span className="font-semibold">상권이 죽거나 임대인이 직접 사용하겠다고 하면
              한 푼도 회수하지 못할 수 있습니다.</span> 그래서 권리금은 &lsquo;자산&rsquo;이
              아니라 &lsquo;잃을 수도 있는 돈&rsquo;으로 보고 계산해야 합니다.
            </p>
          </div>
          <div className="rounded-xl border border-line bg-surface p-4">
            <h4 className="mb-1 text-sm font-semibold text-forest">초도물품</h4>
            <p className="text-sm text-ink">
              <TermExplainer
                term="초도물품"
                explanation="개업할 때 처음 갖춰 두는 재고·원재료·소모품·소도구 일체. 프랜차이즈는 본사가 정한 초도물품 패키지를 의무 구매해야 하는 경우가 많습니다."
              />
              은 개업할 때 처음 채워 넣는 재고와 소도구입니다. 프랜차이즈는 본사가 정한
              초도물품을 의무로 사야 하는 경우가 많고, 이 금액이 생각보다 큽니다. 팔리지 않으면
              그대로 손실이 되므로, 첫 발주량을 보수적으로 잡는 것이 안전합니다.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-lg font-semibold text-ink">3. 보이는 비용 vs 놓치는 비용</h3>
        <p className="text-sm text-ink">
          위 표의 큰 항목들은 누구나 견적에 넣습니다. 문제는 견적서에 잘 안 적히는 자잘한
          비용들입니다. 이것들이 모이면 초기 예산을 수백만 원 단위로 넘기게 만듭니다.
        </p>
        <HiddenCostList
          items={[
            '간판·옥외광고물 제작·설치 및 인허가 비용',
            '소방·전기 증설, 가스·급배수 등 기반 설비 보강비',
            '사업자등록·인허가 과정의 위생교육·보건증 등 부대비용',
            'POS·키오스크·카드단말기·CCTV 설치 및 월 사용료',
            '초기 홍보·오픈 이벤트·배달앱 입점 비용',
            '오픈 전 임대료(공사 기간에도 월세는 나감)와 공과금 예치',
            '명의 변경·이전 시 수수료, 각종 보험 가입비',
          ]}
        />
        <Callout tone="warning">
          특히 <span className="font-semibold">공사 기간의 임대료</span>는 거의 모든 초보가
          빠뜨립니다. 인테리어에 한두 달이 걸려도 그동안 월세·관리비는 그대로 나갑니다. 견적에
          &lsquo;오픈 전 고정비&rsquo;를 반드시 넣으세요.
        </Callout>
      </section>

      <section className="space-y-3">
        <h3 className="text-lg font-semibold text-ink">4. 최악의 경우 잃는 돈 계산</h3>
        <p className="text-sm text-ink">
          1장에서 던진 질문 &mdash;{' '}
          <span className="font-semibold">&ldquo;잘 안 됐을 때 나는 얼마까지 잃어도
          괜찮은가?&rdquo;</span> &mdash; 에 숫자로 답할 차례입니다. 가게를 닫을 때는 그동안 쓴
          돈만 사라지는 게 아니라, <span className="font-semibold">닫기 위해 추가로 드는
          돈</span>이 또 있습니다. 아래는 작은 매장 기준의 예시 가정이며, 실제 손실 규모는 계약
          조건과 잔여 기간에 따라 크게 달라집니다.
        </p>
        <SourceBackedTable
          caption="폐업 시 추가로 잃는 돈 (예시 가정 · 실제와 다름)"
          sourceId={SOURCE_ID}
          rows={[
            {
              label: '원상복구비',
              value: '예시 500만~2,000만 원',
              note: '계약상 철거·원복 의무, 면적·업종별 상이',
            },
            {
              label: '권리금 회수 불가',
              value: '예시 지급액 전액 손실 가능',
              note: '상권·임대인 사정에 따라 0 회수도 발생',
            },
            {
              label: '중도해지 위약금',
              value: '예시 계약 잔여분 기준',
              note: '가맹·임대차 위약 조항별 상이',
            },
            {
              label: '재고·집기 처리 손실',
              value: '예시 장부가의 일부만 회수',
              note: '중고 처분·폐기 시 대부분 손실',
            },
            {
              label: '남은 대출 잔액',
              value: '예시 폐업 후에도 상환 지속',
              note: '가게는 닫혀도 원리금은 그대로',
            },
          ]}
        />
        <p className="text-sm text-ink">
          이 표의 핵심 메시지는 하나입니다.{' '}
          <span className="font-semibold">폐업은 0으로 돌아가는 게 아니라 마이너스에서
          시작합니다.</span> 보증금처럼 일부 돌려받는 돈도 있지만, 권리금·인테리어·초도물품은
          대부분 회수되지 않고, 원상복구비와 대출 잔액은 닫은 뒤에도 따라옵니다. 그래서 &lsquo;잃어도
          괜찮은 한도&rsquo;를 정할 때는 투자한 돈뿐 아니라 이 폐업 비용까지 더해 잡아야 합니다.
        </p>
        <Caveat>
          위 금액은 항목을 빠뜨리지 않게 돕는 예시일 뿐, 견적이 아닙니다. 실제 원상복구·위약금
          범위는 임대차계약서·가맹계약서 조항에 따라 결정되며, 정확한 책임 범위는 가맹거래사·
          변호사 검토가 필요합니다.
        </Caveat>
      </section>

      <section className="space-y-3">
        <h3 className="text-lg font-semibold text-ink">5. 오픈 전 준비 체크리스트</h3>
        <p className="text-sm text-ink">
          숫자를 다 따졌다면, 문을 열기 전에 아래 항목을 점검하세요. 하나라도 비어 있다면 아직
          오픈할 때가 아닙니다.
        </p>
        <DecisionChecklist
          id="pre-open"
          title="오픈 전 준비 체크리스트"
          items={[
            '초기비용 전체(가맹비·보증금·인테리어·초도물품·권리금)를 항목별로 적어 합산했다',
            '간판·소방·POS·홍보 등 견적서에 잘 안 적히는 비용을 따로 더했다',
            '공사 기간에도 나가는 오픈 전 임대료·공과금을 예산에 넣었다',
            '예비 운전자금을 초기비용과 별도로 6~12개월치 확보했다',
            '최악의 경우 잃는 돈(원상복구·권리금·위약금·재고·대출 잔액)을 계산해 보았다',
            '그 최악의 손실이 내가 감당할 수 있는 한도 안에 있다',
            '권리금·중도해지·원상복구 조항을 계약서에서 직접 확인했다',
            '영업신고·사업자등록·인허가 절차와 보건증·위생교육을 마쳤다',
          ]}
        />
      </section>

      <section className="space-y-3 rounded-xl border border-line bg-mist/40 p-4">
        <h3 className="text-base font-semibold text-ink">시작 비용을 알았다면, 다음은 &lsquo;매달 나가는 돈&rsquo;입니다</h3>
        <p className="text-sm text-ink">
          초기비용은 한 번 내는 돈이지만, 가게를 살리고 죽이는 건 매달 반복되는 돈의 흐름입니다.
          다음 장에서는 고정비·변동비·숨은 비용을 정리하고, 월매출이 손에 남는 돈으로 바뀌는
          과정을 워터폴과 시나리오로 따라가 봅니다.
        </p>
        <CtaLink href="#learn/ch5-monthly-cashflow">매달 나가는 돈 + 돈의 흐름 보러 가기</CtaLink>
      </section>
    </div>
  );
}
