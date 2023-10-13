import { AppContext } from 'contexts/context'
import React, { useContext, useEffect } from 'react'

export default function MobileBetSlip() {
  const {
    betSlipBettingSelectionsCount,
    iframeRef,
    betSlipOverlay,
    setBetSlipOverlay,
  } = useContext(AppContext)

  useEffect(() => {
    if (!iframeRef) {
      return () => {}
    }
    const betslipButton = document.querySelector('.BetslipIndicator')

    /**
     * @type {HTMLElement}
     */
    let betslipContent

    if (betslipButton) {
      betslipButton.classList.add('NoSelections')
      betslipButton.addEventListener('click', function () {
        if (!iframeRef) return false
        if (!iframeRef.contentWindow) return false
        // iframeRef.contentWindow.postMessage(
        //   {
        //     type: "OP:goToBetslip",
        //   },
        //   "*"
        // );
        // iframeRef.contentWindow.postMessage(
        //   {
        //     type: "OP:showOpenBets",
        //   },
        //   "*"
        // );
      })

      betslipContent = betslipButton.querySelector('.BetslipIndicatorCounter')
    } else {
      console.warn('There is no betslip button available!')
    }
  }, [])

  return (
    <>
      <div
        className="BetslipWrapper BetslipIndicator lg:hidden"
        id="betslipIndicator"
      >
        <div
          className="BetslipContent"
          onClick={() => {
            if (!iframeRef) {
              return false
            }
            // iframeRef.contentWindow.postMessage(
            //   {
            //     type: "OP:goToBetslip",
            //   },
            //   "*"
            // );
            iframeRef.contentWindow.postMessage(
              {
                type: 'OP:showBetslip',
              },
              '*',
            )
            setBetSlipOverlay(!betSlipOverlay)
            window.scrollTo(0, 0)
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 23 27"
            fill="none"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M1.526 2.515h2.87V6.12h14.209V2.515h2.869c.839 0 1.526.702 1.526 1.56V25.44c0 .858-.687 1.56-1.526 1.56H1.526C.687 27 0 26.298 0 25.44V4.075c0-.859.687-1.56 1.526-1.56zm11.328-1.512l.437.851h4.073v2.997H5.637V1.854H9.71l.438-.85c.572-1.338 2.135-1.338 2.707 0zM4.268 8.484h3.689v3.771H4.267v-3.77zm5.396 0h4.965v1.198H9.663V8.484zm0 2.573h9.07v1.198h-9.07v-1.198zM4.267 14.49h3.689v3.77H4.267v-3.77zm5.396 0h4.965v1.198H9.663V14.49zm0 2.573h9.07v1.198h-9.07v-1.198zm-5.396 3.433h3.689v3.77H4.267v-3.77zm5.396 0h4.965v1.198H9.663v-1.198zm0 2.573h9.07v1.198h-9.07V23.07z"
              fill="#fff"
            />
          </svg>
        </div>
        <span className="CounterBadge BetslipIndicator BetslipIndicatorCounter">
          {betSlipBettingSelectionsCount}
        </span>
      </div>
    </>
  )
}
