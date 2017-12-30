// TODO: deprecate this file/module. redundant.

import Quartz = require('quartz')

export type SetInterval = Quartz.SetInterval

export type ClearNumericInterval = Quartz.ClearNumericInterval

export type ClearTimerInterval = Quartz.ClearTimerInterval

export type ClearInterval = ClearNumericInterval | ClearTimerInterval

export type Timer = Quartz.Timer
