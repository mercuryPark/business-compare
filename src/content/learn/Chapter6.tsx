import { Callout } from '../../components/learn/primitives/Callout';
import { Caveat } from '../../components/learn/primitives/Caveat';
import { CtaLink } from '../../components/learn/primitives/CtaLink';
import { DecisionChecklist } from '../../components/learn/primitives/DecisionChecklist';
import { NumericClaim } from '../../components/learn/primitives/NumericClaim';
import { SourceBackedTable } from '../../components/learn/primitives/SourceBackedTable';
import { TermExplainer } from '../../components/learn/primitives/TermExplainer';

const MIN_WAGE_ID = 'ch6-minimumwage';
const LABOR_ID = 'ch6-moel-labor';
const OPERATIONS_ID = 'ch6-operations';

export function Chapter6() {
  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h2 className="text-xl font-semibold text-ink">일상 운영의 기본기</h2>
        <p className="text-muted">
          가게는 오픈으로 끝나는 게 아니라 매일 반복되는 운영으로 굴러갑니다. 이 장에서는
          내 가게가 적자인지 흑자인지 읽는 법, 사람을 법대로 쓰는 법, 재고·위생·마케팅을
          빠뜨리지 않고 챙기는 기본기를 정리합니다. 마지막의 월 운영 체크리스트는 매달
          한 번씩 다시 펴 보세요.
        </p>
      </header>

      <Caveat>
        이 장의 일부 금액은 시점·지역·업종에 따라 달라집니다. 특히 최저임금·주휴수당 같은
        노동 관련 수치는 매년·상황별로 바뀌므로, 본문의 숫자는 &lsquo;예시&rsquo;로만 보고
        실제 적용액은 최저임금위원회·고용노동부 등 공식 자료와 노무사·전문가 확인이
        필요합니다.
      </Caveat>

      <section className="space-y-3">
        <h3 className="text-lg font-semibold text-ink">1. 손익분기점 — 내 가게가 본전 넘는 매출은 얼마인가</h3>
        <p className="text-sm text-ink">
          매달 &lsquo;얼마를 팔아야 손해를 안 보는가&rsquo;를 모르면, 바쁜데도 적자인지 한가한데도
          흑자인지 알 수가 없습니다. 그 기준선이{' '}
          <TermExplainer
            term="손익분기점"
            explanation="총비용과 매출이 같아져 손익이 0이 되는 매출 수준. 이 매출을 넘겨야 비로소 이익이 납니다."
          />
          입니다.
        </p>
        <p className="text-sm text-ink">
          계산의 핵심은 매출에서 <span className="font-semibold">변동비(팔린 만큼 늘어나는 원재료·수수료)</span>를
          뺀 돈, 즉 한 그릇·한 잔을 팔 때마다 남는 돈으로 <span className="font-semibold">고정비(매출이 0이어도
          나가는 임대료·인건비·대출이자)</span>를 메우는 구조입니다. 고정비를 다 메우는 매출이
          손익분기점이고, 그 위부터가 이익입니다.
        </p>
        <Callout tone="info">
          한 줄로 외워두면 좋은 식: <span className="font-semibold">손익분기 매출 = 고정비 ÷ (1 − 변동비율)</span>.
          변동비율이 높을수록 한 번 팔아 남는 돈이 적어, 같은 고정비라도 더 많이 팔아야
          본전이 됩니다.
        </Callout>
        <SourceBackedTable
          caption="손익분기 매출 계산 예시"
          rows={[
            { label: '변동비율 (원재료·수수료 등)', value: '매출의 40%', note: '예시 가정' },
            { label: '월 고정비 (임대료·인건비·이자)', value: '1,000만 원', note: '예시 가정' },
            { label: '손익분기 월매출', value: '약 1,667만 원', note: '1,000만 ÷ (1 − 0.4)' },
          ]}
          sourceId={OPERATIONS_ID}
        />
        <p className="text-sm text-ink">
          여기서 한 가지 함정이 있습니다. 손익분기점을 &lsquo;넘겼다&rsquo;고 안심하면 안 됩니다. 그
          계산에 <span className="font-semibold">사장님 본인의 인건비(생활비)와 세금 적립</span>이 빠져
          있으면, 장부상 본전이어도 실제로는 내가 공짜로 일한 셈입니다. 손익분기점은 반드시
          내 인건비까지 포함해 다시 계산하세요.
        </p>
        <Caveat>
          위 변동비율·고정비·손익분기 매출은 모두 예시 가정입니다. 실제 비율은 업종·입지·운영
          방식에 따라 전혀 다르게 나오므로, 본인 가게의 실제 비용으로 직접 계산해야 합니다.
        </Caveat>
      </section>

      <section className="space-y-3">
        <h3 className="text-lg font-semibold text-ink">2. 인력 관리 — 근로계약서·최저임금·주휴수당</h3>
        <p className="text-sm text-ink">
          직원이나 아르바이트를 한 명이라도 쓰면, 사장님은 &lsquo;고용주&rsquo;가 됩니다. 인심이
          아니라 법으로 정해진 것들이 있고, 이걸 빠뜨리면 나중에 진정·체불 문제로 목돈이
          나갈 수 있습니다.
        </p>

        <div className="space-y-3">
          <div className="rounded-xl border border-line bg-surface p-4">
            <h4 className="mb-1 text-sm font-semibold text-forest">근로계약서는 의무입니다</h4>
            <p className="text-sm text-ink">
              <TermExplainer
                term="근로계약서"
                explanation="근무 시간·임금·업무 내용 등을 적어 사용자와 근로자가 서로 보관하는 서면. 단시간·아르바이트도 작성·교부 의무가 있습니다."
              />
              는 정규직뿐 아니라 단기 아르바이트에게도 반드시 작성해서 한 부를 내주어야 합니다.
              작성·교부를 하지 않으면 그 자체로 과태료 대상이 됩니다. 시급, 근무 요일·시간,
              주휴 여부, 수습 적용 여부를 명확히 적으세요.
            </p>
          </div>
          <div className="rounded-xl border border-line bg-surface p-4">
            <h4 className="mb-1 text-sm font-semibold text-forest">최저임금 — 매년 새로 고시됩니다</h4>
            <p className="text-sm text-ink">
              시급은 <span className="font-semibold">매년 고시되는 최저임금</span> 이상이어야 합니다.
              최저임금은 해마다 바뀌므로 &lsquo;작년 시급&rsquo;을 그대로 쓰면 위반이 될 수 있습니다.
              연도가 바뀌면 반드시 그 해의 고시 금액을 다시 확인하세요.
            </p>
          </div>
        </div>

        <NumericClaim
          label="최저임금(시급)"
          value="매년 고시되는 그 해 최저임금"
          basis="연도별로 변동 — 본문의 어떤 숫자도 그대로 쓰지 말 것. 적용 연도의 고시 금액을 최저임금위원회에서 직접 확인"
          sourceId={MIN_WAGE_ID}
        />
        <NumericClaim
          label="주휴수당 발생 기준"
          value="1주 소정근로 15시간 이상 + 개근 시 발생"
          basis="기준 — 주휴수당은 1주 소정근로시간이 일정 시간 이상이고 결근 없이 일한 경우 발생. 구체 요건·계산은 고용노동부 안내·노무사 확인 필요"
          sourceId={LABOR_ID}
        />
        <p className="text-sm text-ink">
          <TermExplainer
            term="주휴수당"
            explanation="1주 동안 정해진 근무일을 개근하고 소정근로시간이 일정 기준 이상이면, 유급으로 쉬는 하루치 임금을 추가로 지급해야 하는 제도."
          />
          은 초보 사장님이 가장 자주 빠뜨리는 인건비입니다. &lsquo;주 15시간 이상 일하는 직원에게는
          실제 일한 시간 외에 하루치 임금이 더 나간다&rsquo;는 점을 인건비 계산에 처음부터 넣어두어야
          합니다. 빠뜨리면 나중에 체불로 한꺼번에 청구될 수 있습니다.
        </p>
        <Callout tone="warning">
          최저임금 미달 지급, 근로계약서 미작성, 주휴수당 누락은 모두 &lsquo;몰라서&rsquo; 생기는
          위반입니다. 인건비를 예상할 때는 시급뿐 아니라 <span className="font-semibold">주휴수당·4대보험
          사업주 부담분</span>까지 합쳐서 잡아야 실제 나가는 돈이 보입니다.
        </Callout>
      </section>

      <section className="space-y-3">
        <h3 className="text-lg font-semibold text-ink">3. 위생·CS — 한 번의 사고가 가게를 닫는다</h3>
        <p className="text-sm text-ink">
          매출을 올리는 일보다 &lsquo;사고를 안 내는 일&rsquo;이 먼저입니다. 식중독 한 건, 이물질 한 번,
          험한 응대 후기 하나가 그동안 쌓은 단골을 한 번에 무너뜨립니다.
        </p>
        <ul className="list-disc space-y-1 pl-5 text-sm text-ink">
          <li>유통기한·보관온도 관리, 선입선출(먼저 들어온 재료 먼저 사용)을 습관으로.</li>
          <li>주방·집기 청소 루틴을 정해 두고, 보건증·위생교육 갱신 시기를 달력에 표시.</li>
          <li>
            컴플레인은 &lsquo;빠르게·정중하게·기록으로&rsquo; 처리. 리뷰·민원 응대 기준을 미리 정해두면
            당황하지 않습니다.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h3 className="text-lg font-semibold text-ink">4. 재고·발주 — 돈이 재료로 잠기지 않게</h3>
        <p className="text-sm text-ink">
          재고는 곧 묶인 현금입니다. 너무 많이 사두면 폐기 로스로 버려지고, 너무 적게 사두면
          품절로 매출을 놓칩니다. 둘 다 손해이므로 &lsquo;감&rsquo;이 아니라 기록으로 관리해야 합니다.
        </p>
        <ul className="list-disc space-y-1 pl-5 text-sm text-ink">
          <li>잘 나가는 메뉴·요일별 판매량을 기록해 발주량의 근거로 삼기.</li>
          <li>폐기(버린 재료)도 매일 적기 — 폐기 로스는 눈에 안 보이는 비용입니다.</li>
          <li>거래처를 한 곳에만 의존하지 말고, 단가·납기를 정기적으로 비교.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h3 className="text-lg font-semibold text-ink">5. 기본 마케팅 — 돈을 쓰기 전에 공짜부터</h3>
        <p className="text-sm text-ink">
          초보 사장님일수록 광고비부터 쓰려 하지만, 비용 없이 할 수 있는 것부터 다지는 편이
          효율이 높습니다.
        </p>
        <ul className="list-disc space-y-1 pl-5 text-sm text-ink">
          <li>네이버 플레이스·지도 등록과 영업시간·메뉴·사진 최신화(무료, 노출에 직접 영향).</li>
          <li>리뷰 관리 — 좋은 리뷰는 감사 인사, 나쁜 리뷰는 방어가 아니라 개선 신호로.</li>
          <li>재방문을 만드는 작은 장치(쿠폰·단골 응대)가 신규 유입 광고보다 싸게 먹힙니다.</li>
        </ul>
        <Caveat>
          유료 광고·배달앱 프로모션은 &lsquo;매출이 오른 만큼 수수료·광고비도 오른다&rsquo;는 점을 잊지
          마세요. 광고를 켜기 전에 손익분기점 계산에 그 비용을 먼저 넣어 보세요.
        </Caveat>
      </section>

      <section className="space-y-3">
        <h3 className="text-lg font-semibold text-ink">6. 월 운영 체크리스트</h3>
        <p className="text-sm text-ink">
          아래 항목은 매달 한 번씩 점검하기 위한 것입니다. 체크 상태는 이 브라우저에 저장되니,
          다음 달에 다시 펴서 확인하세요.
        </p>
        <DecisionChecklist
          id="monthly"
          title="월 운영 체크리스트"
          items={[
            '이번 달 손익분기점을 넘겼는지 매출·비용으로 확인했다(내 인건비·세금 포함)',
            '직원 전원과 근로계약서를 작성·교부했고 시급이 그 해 최저임금 이상이다',
            '주휴수당·4대보험 사업주 부담분을 인건비에 반영해 계산했다',
            '부가세·소득세로 떼어 둘 돈을 별도 통장에 적립했다',
            '보건증·위생교육 갱신 시기와 주방 청소 루틴을 점검했다',
            '재고·폐기 로스를 기록하고 다음 달 발주량을 조정했다',
            '플레이스 정보(영업시간·메뉴·사진)와 리뷰 응대를 점검했다',
          ]}
        />
      </section>

      <section className="space-y-3 rounded-xl border border-line bg-mist/40 p-4">
        <h3 className="text-base font-semibold text-ink">운영이 흔들리기 시작했다면</h3>
        <p className="text-sm text-ink">
          기본기를 다져도 매출은 흔들릴 수 있습니다. 매출이 안 나올 때 무엇부터 의심하고, 어떤
          비용은 줄여도 되고 어떤 비용은 줄이면 안 되는지 &mdash; 다음 장에서 진단 순서와
          회복·손절 판단을 정리합니다.
        </p>
        <CtaLink href="#learn/ch7-low-sales">매출이 안 나올 때 — 진단과 회복 보러 가기</CtaLink>
      </section>
    </div>
  );
}
