import { Callout } from '../../components/learn/primitives/Callout';
import { Caveat } from '../../components/learn/primitives/Caveat';
import { CashflowCalendar } from '../../components/learn/primitives/CashflowCalendar';
import { CashflowWaterfall } from '../../components/learn/primitives/CashflowWaterfall';
import { CtaLink } from '../../components/learn/primitives/CtaLink';
import { HiddenCostList } from '../../components/learn/primitives/HiddenCostList';
import { MoneyScenario } from '../../components/learn/primitives/MoneyScenario';
import { NumericClaim } from '../../components/learn/primitives/NumericClaim';
import { TermExplainer } from '../../components/learn/primitives/TermExplainer';

const ILLUSTRATION_ID = 'ch5-semas-cashflow';
const VAT_ID = 'ch5-nts-vat';
const INCOME_TAX_ID = 'ch5-nts-income-tax';
const INSURE_ID = 'ch5-4insure';

export function Chapter5() {
  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h2 className="text-xl font-semibold text-ink">매달 나가는 돈 + 돈의 흐름</h2>
        <p className="text-muted">
          가게의 생사를 가르는 건 시작 비용이 아니라, 매달 반복되는 돈의 흐름입니다. 매출이
          통장에 찍혀도 그게 내 돈이 아닙니다. 원가·인건비·임대료·수수료·세금·대출이 차례로
          빠져나가고 나서야 &lsquo;손에 남는 돈&rsquo;이 보입니다. 이 장은 그 흐름을 한 줄씩
          따라갑니다.
        </p>
      </header>

      <Caveat>
        이 장의 워터폴·시나리오·캘린더 숫자는 모두{' '}
        <span className="font-semibold">예시 가정</span>이며 공식 통계가 아닙니다. 실제 비율은
        입지·업종·규모에 따라 크게 다릅니다. 세금의 정확한 세율·기준·납부 시기는 국세청 등 공식
        자료와 세무사 확인이 필요합니다.
      </Caveat>

      <section className="space-y-3">
        <h3 className="text-lg font-semibold text-ink">1. 고정비 · 변동비 · 숨은 비용</h3>
        <p className="text-sm text-ink">
          매달 나가는 돈은 성격에 따라 세 종류로 나눠 보면 관리가 쉬워집니다.
        </p>
        <ul className="list-disc space-y-1 pl-5 text-sm text-ink">
          <li>
            <span className="font-semibold">고정비</span> — 매출이 0이어도 나가는 돈. 임대료,
            인건비,{' '}
            <TermExplainer
              term="4대보험"
              explanation="국민연금·건강보험·고용보험·산재보험. 직원을 두면 사업주도 일부를 부담하며, 매달 납부합니다."
            />
            , 로열티·광고비, 공과금, 보험료, 대출이자가 여기에 속합니다.
          </li>
          <li>
            <span className="font-semibold">변동비</span> — 팔린 만큼 늘어나는 돈. 원재료비,
            소모품비처럼 매출에 비례합니다.
          </li>
          <li>
            <span className="font-semibold">숨은 비용</span> — 매달 통장에서 빠지지는 않지만,
            나중에 한꺼번에 청구되거나 서서히 가게를 갉아먹는 돈입니다. 이걸 빼먹으면 &lsquo;남는
            것 같은데 늘 돈이 없는&rsquo; 상태가 됩니다.
          </li>
        </ul>
        <HiddenCostList
          items={[
            '부가세 적립 — 받은 부가세는 내 돈이 아니라 맡아둔 돈, 따로 떼어 둘 것',
            '종합소득세 — 1년 이익에 대해 다음 해 5월에 한꺼번에 정산',
            '카드·배달앱 수수료 — 매출에서 자동으로 빠져나가는 비율 비용',
            '폐기 로스 — 못 팔고 버리는 식자재·재고 손실',
            '감가상각·재투자 — 설비·인테리어는 시간이 지나면 다시 돈이 든다',
            '명절 상여·휴가비 등 비정기 인건비',
          ]}
        />
        <Callout tone="warning">
          가장 위험한 숨은 비용은 <span className="font-semibold">세금</span>입니다. 매달 잘
          남는 것 같아도 부가세·종합소득세를 떼어 두지 않으면, 납부 시기에 목돈이 한꺼번에
          빠져나가 흑자인데도 현금이 마릅니다.
        </Callout>
      </section>

      <section className="space-y-3">
        <h3 className="text-lg font-semibold text-ink">2. 월 손익 워터폴 — 매출이 손에 남는 돈이 되기까지</h3>
        <p className="text-sm text-ink">
          월매출에서 비용이 차례로 빠져나가는 과정을 그림으로 보면, &lsquo;매출 = 내 돈&rsquo;이
          아니라는 사실이 분명해집니다. 아래는{' '}
          <span className="font-semibold">월매출 3,000만 원을 가정한 예시</span>이며, 실제 비율은
          업종·입지에 따라 크게 다릅니다.
        </p>
        <CashflowWaterfall
          sourceId={ILLUSTRATION_ID}
          steps={[
            { label: '월매출', amount: '예시 3,000만 원', kind: 'start' },
            { label: '원재료비', amount: '예시 900만 원', kind: 'deduction' },
            { label: '인건비(4대보험 포함)', amount: '예시 750만 원', kind: 'deduction' },
            { label: '임대료·관리비', amount: '예시 300만 원', kind: 'deduction' },
            { label: '카드·배달 수수료', amount: '예시 250만 원', kind: 'deduction' },
            { label: '세금 적립(부가세·소득세)', amount: '예시 300만 원', kind: 'deduction' },
            { label: '대출 원리금', amount: '예시 200만 원', kind: 'deduction' },
            { label: '손에 남는 돈', amount: '예시 300만 원', kind: 'result' },
          ]}
        />
        <p className="text-sm text-ink">
          3,000만 원을 팔아도 손에 남는 건 예시로 300만 원 안팎입니다.{' '}
          <span className="font-semibold">여기서 사장님 본인의 생활비까지 나와야 한다</span>는
          점을 잊지 마세요. 그래서 매출 규모보다 &lsquo;비용 구조&rsquo;가 더 중요합니다.
        </p>
        <Caveat>
          위 비율은 항목을 빠뜨리지 않게 돕는 예시 가정일 뿐입니다. 실제 원가율·인건비율·수수료는
          업종과 운영 방식에 따라 전혀 다르게 나옵니다.
        </Caveat>
      </section>

      <section className="space-y-3">
        <h3 className="text-lg font-semibold text-ink">3. 현금 유출 캘린더 — 언제 돈이 빠지는가</h3>
        <p className="text-sm text-ink">
          비용은 금액뿐 아니라 <span className="font-semibold">타이밍</span>이 중요합니다. 특히
          세금·보험은 매달이 아니라 특정 달에 목돈으로 빠지기 때문에, 미리 알고 떼어 두지 않으면
          그달에 현금이 막힙니다. 아래 시기는 일반적인 안내이며, 과세 유형(간이/일반)과 직원
          유무에 따라 달라집니다.
        </p>
        <CashflowCalendar
          sourceId={INSURE_ID}
          entries={[
            { month: '매달', item: '4대보험·원천세(직원 급여에서 원천징수·납부)' },
            { month: '1·4·7·10월', item: '부가세 — 법인/일반과세 분기 신고·납부(유형별 상이)' },
            { month: '1·7월', item: '부가세 — 개인 일반과세 반기 확정신고(유형별 상이)' },
            { month: '5월', item: '종합소득세 — 전년도 사업소득 확정신고·납부' },
          ]}
        />
        <p className="text-sm text-ink">
          위 캘린더에서 꼭 기억할 두 가지는{' '}
          <TermExplainer
            term="부가세"
            explanation="부가가치세. 손님에게 받은 부가세에서 매입 시 낸 부가세를 뺀 차액을 정해진 시기에 신고·납부합니다. 받은 부가세는 내 이익이 아니라 맡아둔 돈입니다."
          />{' '}
          납부월과{' '}
          <TermExplainer
            term="종합소득세"
            explanation="1년 동안의 사업소득 등을 합산해 다음 해 5월에 신고·납부하는 세금. 이익이 클수록 세 부담도 커집니다."
          />{' '}
          정산월(5월)입니다. 이 달들에 목돈이 나간다는 걸 모르면, 평소엔 잘 굴러가던 가게가
          납부월에 갑자기 휘청입니다.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <NumericClaim
            label="부가세 신고·납부 시기"
            value="과세 유형별 분기/반기 정기 신고"
            basis="정확한 대상·시기·세율은 과세 유형에 따라 다름 — 국세청 자료·세무사 확인 필요"
            sourceId={VAT_ID}
          />
          <NumericClaim
            label="종합소득세 정산"
            value="매년 5월 전년도 소득 확정신고"
            basis="구체적 세율·공제는 소득 규모에 따라 다름 — 국세청 자료·세무사 확인 필요"
            sourceId={INCOME_TAX_ID}
          />
        </div>
        <Callout tone="info">
          매달 받은 부가세는 별도 통장에 따로 떼어 두세요. 본인 과세 유형(간이/일반)에 맞는
          신고·납부 시기는 국세청 부가가치세·종합소득세 안내에서 직접 확인하세요.
        </Callout>
      </section>

      <section className="space-y-3">
        <h3 className="text-lg font-semibold text-ink">4. 매출 시나리오 3종</h3>
        <p className="text-sm text-ink">
          같은 가게라도 매출이 얼마냐에 따라 손에 남는 돈은 크게 달라집니다. 아래 세 가지는
          모두 <span className="font-semibold">예시 가정</span>으로, 고정비는 비슷하게 두고
          매출만 바꿨을 때 손익이 어떻게 변하는지 감을 잡기 위한 것입니다.
        </p>
        <div className="space-y-3">
          <MoneyScenario
            title="시나리오 A — 손익분기 부근"
            monthlySales="예시 2,000만 원"
            sourceId={ILLUSTRATION_ID}
            lines={[
              { label: '원재료비', amount: '예시 −600만 원' },
              { label: '인건비(4대보험 포함)', amount: '예시 −650만 원' },
              { label: '임대료·관리비', amount: '예시 −300만 원' },
              { label: '카드·배달 수수료', amount: '예시 −170만 원' },
              { label: '세금 적립·대출 원리금', amount: '예시 −300만 원' },
            ]}
            takeHome="예시 −20만 원 (적자~본전)"
          />
          <MoneyScenario
            title="시나리오 B — 자리 잡은 가게"
            monthlySales="예시 3,000만 원"
            sourceId={ILLUSTRATION_ID}
            lines={[
              { label: '원재료비', amount: '예시 −900만 원' },
              { label: '인건비(4대보험 포함)', amount: '예시 −750만 원' },
              { label: '임대료·관리비', amount: '예시 −300만 원' },
              { label: '카드·배달 수수료', amount: '예시 −250만 원' },
              { label: '세금 적립·대출 원리금', amount: '예시 −500만 원' },
            ]}
            takeHome="예시 300만 원"
          />
          <MoneyScenario
            title="시나리오 C — 잘 되는 가게"
            monthlySales="예시 4,000만 원"
            sourceId={ILLUSTRATION_ID}
            lines={[
              { label: '원재료비', amount: '예시 −1,200만 원' },
              { label: '인건비(4대보험 포함)', amount: '예시 −900만 원' },
              { label: '임대료·관리비', amount: '예시 −300만 원' },
              { label: '카드·배달 수수료', amount: '예시 −330만 원' },
              { label: '세금 적립·대출 원리금', amount: '예시 −620만 원' },
            ]}
            takeHome="예시 650만 원"
          />
        </div>
        <p className="text-sm text-ink">
          매출이 2배가 돼도 손에 남는 돈이 2배가 되지는 않습니다. 매출이 오르면 원가·수수료·세금도
          같이 오르기 때문입니다. 그래서{' '}
          <TermExplainer
            term="손익분기점"
            explanation="총비용과 매출이 같아져 손익이 0이 되는 매출 수준. 이 점을 넘겨야 비로소 이익이 납니다. 구체적인 계산은 다음 장에서 다룹니다."
          />
          을 넘기는 것이 첫 목표이고, 그 위에서 비용 구조를 다듬는 것이 다음 과제입니다(자세한
          계산은 다음 장).
        </p>
        <Caveat>
          세 시나리오의 모든 금액은 예시 가정이며 실제는 입지·업종·규모에 따라 크게 다릅니다.
          본인 가게의 실제 비용으로 직접 다시 계산해 보세요.
        </Caveat>
      </section>

      <section className="space-y-3 rounded-xl border border-line bg-mist/40 p-4">
        <h3 className="text-base font-semibold text-ink">돈의 흐름을 봤다면, 다음은 &lsquo;운영의 기본기&rsquo;입니다</h3>
        <p className="text-sm text-ink">
          손익분기점을 정확히 계산하는 법, 사람을 쓰는 법(근로계약·주휴수당·최저임금), 재고와
          마케팅까지 &mdash; 매달의 돈 흐름을 실제 운영 결정으로 바꾸는 방법을 다음 장에서
          정리합니다.
        </p>
        <CtaLink href="#learn/ch6-operations">일상 운영의 기본기 보러 가기</CtaLink>
      </section>
    </div>
  );
}
